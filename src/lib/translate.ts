/**
 * Traduzione automatica in inglese di titoli e descrizioni degli eventi, in fase di build.
 *
 * - Lavora solo sugli eventi SENZA titolo inglese (le colonne inglesi del foglio di Lara vincono).
 * - Memoria in node_modules/.cache/fiaschetto/traduzioni.json (Netlify la conserva fra le build):
 *   ogni testo si traduce una volta sola, chiave = hash di titolo+descrizione.
 * - Un'unica chiamata all'API di Claude (Haiku 5.5) per tutti i testi nuovi, risposta in JSON.
 * - Serve la variabile ANTHROPIC_API_KEY sul sito Netlify. Se manca, o se l'API non risponde,
 *   il sito si costruisce lo stesso e gli eventi restano in italiano anche sulla versione inglese
 *   (la pagina lo dice: "Details in Italian").
 */
import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Ev } from "./events";

const CACHE = join(process.cwd(), "node_modules", ".cache", "fiaschetto", "traduzioni.json");
// Haiku 5.5, scelta di Daniel (2026-10-14): per una traduzione basta e costa quaranta volte meno di Opus.
const MODEL = "claude-haiku-5-5";

type Entry = { titleEn: string; descriptionEn: string | null };
const keyOf = (e: Ev) => createHash("sha1").update(`${e.title}\n${e.description ?? ""}`).digest("hex");

function loadCache(): Record<string, Entry> {
  try { return JSON.parse(readFileSync(CACHE, "utf8")); } catch { return {}; }
}
function saveCache(c: Record<string, Entry>) {
  try { mkdirSync(dirname(CACHE), { recursive: true }); writeFileSync(CACHE, JSON.stringify(c)); } catch { /* la cache è un di più */ }
}

const SYSTEM = `You translate event listings for the website of a small wine shop in Montespertoli, Tuscany.
You receive a JSON array of events, each with "id", "title" and "description" in Italian (description may be null).
Reply with ONLY a JSON array (no prose, no code fences) of objects with the same "id", and "title" and "description" translated into natural British English for a foreign visitor.
Rules:
- Translate faithfully; add nothing, drop nothing, no comments.
- ALWAYS translate the title. Only a brand-like festival name inside it stays in Italian (FORME, Olea, Non lo butto, Calici di note, Moments Musicaux, Festa del Vino, Cene d'Estate); every descriptive word is translated. Examples:
  "FORME 2026 - Festival di Arte Pubblica" -> "FORME 2026 - Public Art Festival"
  "Mostra fotografica sugli anni del Covid-19" -> "Photography exhibition on the Covid-19 years"
  "Halloween in piazza" -> "Halloween in the square"
  "Mercatino all'Anselmo" -> "Market at the Anselmo"
  "Sant'Andrea e accensione dell'albero" -> "Saint Andrew's Day and the lighting of the tree"
  A title may come back identical to the Italian only if it contains no translatable word (e.g. "Olea").
- In descriptions keep proper names in Italian: places, squares, streets, venues, associations, festival names. When a festival name is opaque, add a short English gloss in parentheses the first time it appears in the description.
- Keep dates, times, prices, phone numbers and addresses exactly as they are.
- If "description" is null, return null for it.`;

export async function translateEvents(events: Ev[]): Promise<void> {
  const cache = loadCache();
  const todo = events.filter((e) => !e.titleEn);
  for (const e of todo) {
    const c = cache[keyOf(e)];
    if (c) { e.titleEn = c.titleEn; e.descriptionEn = e.descriptionEn ?? c.descriptionEn; }
  }
  const missing = todo.filter((e) => !e.titleEn);
  const fromCache = todo.length - missing.length;
  if (!missing.length) {
    console.log(`[traduzioni] ${fromCache} eventi già tradotti in memoria, niente da chiedere.`);
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    console.warn(`[traduzioni] ANTHROPIC_API_KEY assente: ${missing.length} eventi restano in italiano sul sito inglese.`);
    return;
  }

  const client = new Anthropic();
  const items = missing.map((e, id) => ({ id, title: e.title, description: e.description }));
  try {
    // Haiku 5.5 non ha il ripiego server-side sui rifiuti: se rifiuta, gli eventi restano in italiano.
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(items) }],
    });
    if (res.stop_reason === "refusal") {
      console.warn("[traduzioni] richiesta rifiutata dal modello: eventi lasciati in italiano.");
      return;
    }
    const text = res.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("");
    const json = text.slice(text.indexOf("["), text.lastIndexOf("]") + 1);
    const parsed = JSON.parse(json) as { id: number; title?: unknown; description?: unknown }[];
    let done = 0;
    for (const t of parsed) {
      const e = missing[t.id];
      if (!e || typeof t.title !== "string" || !t.title.trim()) continue;
      e.titleEn = t.title.trim();
      if (!e.descriptionEn && typeof t.description === "string" && t.description.trim()) e.descriptionEn = t.description.trim();
      cache[keyOf(e)] = { titleEn: e.titleEn, descriptionEn: e.descriptionEn ?? null };
      done++;
    }
    saveCache(cache);
    const u = res.usage;
    console.log(`[traduzioni] ${done}/${missing.length} eventi tradotti ora (${fromCache} dalla memoria) — ${u.input_tokens} token in, ${u.output_tokens} out, modello ${res.model}.`);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) console.warn("[traduzioni] chiave API non valida: eventi lasciati in italiano.");
    else if (err instanceof Anthropic.RateLimitError) console.warn("[traduzioni] limite di richieste raggiunto: riprovo alla prossima build.");
    else if (err instanceof Anthropic.APIError) console.warn(`[traduzioni] errore API ${err.status}: ${err.message}`);
    else console.warn(`[traduzioni] risposta non leggibile (${(err as Error).message}): eventi lasciati in italiano.`);
  }
}

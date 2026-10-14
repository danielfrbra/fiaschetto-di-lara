/**
 * I produttori che si vedono nella sezione "Il territorio": li scrive Lara nel
 * foglio Google, linguetta "Produttori" (prima riga "Produttore", poi un nome per riga).
 * Si legge in fase di build come CSV; se la linguetta non c'è o non risponde,
 * resta la lista di partenza. Vale lo stesso meccanismo del foglio eventi:
 * copia pubblicata in /_fonti/produttori.csv e controllo ogni cinque minuti.
 */
import { EVENT_SOURCES } from "../config/events";
import { fetchText } from "./events";
import { parseCsv } from "./csv";

export const DEFAULT_PRODUCERS = ["Tenuta Ripalta"];

let cache: Promise<string[]> | null = null;
export function loadProducers(): Promise<string[]> {
  if (!cache) cache = load();
  return cache;
}

async function load(): Promise<string[]> {
  const text = await fetchText(EVENT_SOURCES.producersCsv(EVENT_SOURCES.sheetId), "foglio Produttori", "produttori.csv");
  if (!text || /<html/i.test(text)) {
    console.log(`[produttori] linguetta "Produttori" non trovata: uso la lista di partenza (${DEFAULT_PRODUCERS.join(", ")}).`);
    return DEFAULT_PRODUCERS;
  }
  const rows = parseCsv(text).map((r) => (r[0] ?? "").trim()).filter(Boolean);
  const names = rows.filter((n, i) => !(i === 0 && /^(produttor[ei]|nome|cantina|cantine)$/i.test(n)));
  const unique = [...new Set(names)];
  if (!unique.length) {
    console.log("[produttori] linguetta vuota: uso la lista di partenza.");
    return DEFAULT_PRODUCERS;
  }
  console.log(`[produttori] ${unique.length} produttori dal foglio: ${unique.slice(0, 4).join(", ")}${unique.length > 4 ? "…" : ""}`);
  return unique;
}

// Ogni cinque minuti: il foglio di Lara è cambiato rispetto a quello con cui il
// sito è stato costruito? Se sì, chiede a Netlify di ricostruire. Così un evento
// scritto nel foglio compare online entro pochi minuti, senza che nessuno faccia niente.
//
// Non serve memoria: il confronto è fra il foglio (letto da Google) e la copia che
// la build pubblica in /_fonti/foglio.csv. Se una delle due non si legge, non fa nulla:
// ci pensa la ricostruzione del mattino (rebuild.mjs).
import { EVENT_SOURCES } from "../../src/config/events.ts";

const SITE = process.env.URL || "https://fiaschetto-di-lara.netlify.app";

export const decide = (sheet, live) => {
  if (sheet == null) return "foglio non leggibile: aspetto";
  if (live == null) return "copia pubblicata assente: aspetto la ricostruzione del mattino";
  return sheet.trim() === live.trim() ? "uguale" : "diverso";
};

const read = async (url) => {
  try {
    const r = await fetch(url, { cache: "no-store", headers: { "User-Agent": "fiaschetto-di-lara (controllo foglio)" } });
    return r.ok ? await r.text() : null;
  } catch { return null; }
};

export default async () => {
  const [sheet, live] = await Promise.all([
    read(EVENT_SOURCES.sheetCsv(EVENT_SOURCES.sheetId)),
    read(`${SITE}/_fonti/foglio.csv`),
  ]);
  const esito = decide(sheet, live);
  if (esito !== "diverso") { console.log(`controllo foglio: ${esito}`); return new Response(esito); }
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) { console.error("BUILD_HOOK_URL non impostata"); return new Response("missing BUILD_HOOK_URL", { status: 500 }); }
  const r = await fetch(hook, { method: "POST" });
  console.log(`controllo foglio: diverso → ricostruzione richiesta (HTTP ${r.status})`);
  return new Response(`rebuild: ${r.status}`);
};

export const config = { schedule: "*/5 * * * *" };

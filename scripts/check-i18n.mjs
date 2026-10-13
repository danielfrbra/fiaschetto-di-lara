// Controlla che it.json ed en.json abbiano ESATTAMENTE le stesse chiavi.
// Gira prima di ogni build: una chiave mancante in una lingua è un errore, non una sorpresa online.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const load = (l) => JSON.parse(readFileSync(join(here, "..", "src", "i18n", `${l}.json`), "utf8"));
const flat = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}`]
  );

const it = new Set(flat(load("it")));
const en = new Set(flat(load("en")));
const onlyIt = [...it].filter((k) => !en.has(k));
const onlyEn = [...en].filter((k) => !it.has(k));

if (onlyIt.length || onlyEn.length) {
  if (onlyIt.length) console.error("Chiavi solo in it.json:", onlyIt.join(", "));
  if (onlyEn.length) console.error("Chiavi solo in en.json:", onlyEn.join(", "));
  process.exit(1);
}
console.log(`i18n ok — ${it.size} chiavi per lingua`);

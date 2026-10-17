import { defineConfig } from "astro/config";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

/**
 * A fine build pubblica, in /_fonti/foglio.csv, la copia del foglio Google con
 * cui il sito è stato costruito. Serve alla funzione programmata
 * netlify/functions/controlla-foglio.mjs: ogni cinque minuti confronta il foglio
 * di Lara con questa copia e, se sono diversi, fa ripartire la ricostruzione.
 * La copia la scrive src/lib/events.ts nella cache quando legge il foglio.
 */
const copiaFoglio = () => ({
  name: "copia-foglio",
  hooks: {
    "astro:build:done": ({ dir, logger }) => {
      const out = join(fileURLToPath(dir), "_fonti");
      mkdirSync(out, { recursive: true });
      for (const name of ["foglio.csv", "produttori.csv"]) {
        const src = join(process.cwd(), "node_modules", ".cache", "fiaschetto", name);
        if (!existsSync(src)) { logger.warn(`nessuna copia di ${name} da pubblicare`); continue; }
        copyFileSync(src, join(out, name));
        logger.info(`copia pubblicata in /_fonti/${name}`);
      }
    },
  },
});

export default defineConfig({
  // Dominio di Lara (Aruba), attivo dal 2026-10-17. Il sottodominio Netlify reindirizza qui (netlify.toml).
  site: "https://ilfiaschettodilara.it",
  // Netlify serve le cartelle con la barra finale e reindirizza /eventi → /eventi/.
  // Mettiamo la barra ovunque, così canonical, hreflang e link coincidono con quello che serve davvero: zero redirect.
  trailingSlash: "always",
  // Tutto il CSS dentro l'HTML: una richiesta in meno prima del primo disegno (Lighthouse lo segnalava come bloccante).
  build: { inlineStylesheets: "always" },
  integrations: [copiaFoglio()],
});

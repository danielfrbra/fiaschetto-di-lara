import { defineConfig } from "astro/config";

export default defineConfig({
  // Finché Lara non compra il dominio, il sito vive sul sottodominio Netlify.
  site: "https://fiaschetto-di-lara.netlify.app",
  // Netlify serve le cartelle con la barra finale e reindirizza /eventi → /eventi/.
  // Mettiamo la barra ovunque, così canonical, hreflang e link coincidono con quello che serve davvero: zero redirect.
  trailingSlash: "always",
  // Tutto il CSS dentro l'HTML: una richiesta in meno prima del primo disegno (Lighthouse lo segnalava come bloccante).
  build: { inlineStylesheets: "always" },
});

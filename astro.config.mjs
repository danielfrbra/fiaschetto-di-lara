import { defineConfig } from "astro/config";

export default defineConfig({
  // Finché Lara non compra il dominio, il sito vive sul sottodominio Netlify.
  site: "https://fiaschetto-di-lara.netlify.app",
  trailingSlash: "never",
  build: { inlineStylesheets: "auto" },
});

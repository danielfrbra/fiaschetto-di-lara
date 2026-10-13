// Genera le varianti delle immagini del sito con sharp (arriva con Astro, nessuna dipendenza in più):
//   poster dei video  → 1280 e 800 px, JPEG + WebP
//   foto della galleria → 1600 e 800 px, JPEG + WebP
// Sorgenti: ../materiali/immagini (foto) e public/media/posters/*.jpg (primo fotogramma dei video).
//   node tools/images.mjs
import sharp from "sharp";
import { readFileSync, existsSync } from "node:fs";

const out = async (src, dest, width, fmt, q) => {
  const img = sharp(src).rotate().resize({ width, withoutEnlargement: true });
  const r = fmt === "webp" ? await img.webp({ quality: q }).toFile(dest) : await img.jpeg({ quality: q, mozjpeg: true }).toFile(dest);
  console.log(`${dest}  ${r.width}x${r.height}  ${Math.round(r.size / 1024)} KB`);
  return r;
};

// Poster: il primo fotogramma già estratto (JPEG 1280x720) è la sorgente.
for (const n of ["A", "B", "C", "D"]) {
  const src = `public/media/posters/${n}.jpg`;
  if (!existsSync(src)) continue;
  const buf = readFileSync(src); // la sorgente viene sovrascritta: leggo prima
  await out(buf, `public/media/posters/${n}-800.jpg`, 800, "jpeg", 78);
  await out(buf, `public/media/posters/${n}.webp`, 1280, "webp", 78);
  await out(buf, `public/media/posters/${n}-800.webp`, 800, "webp", 78);
  await out(buf, `public/media/posters/${n}.jpg`, 1280, "jpeg", 78);
}
// Galleria: dalle sorgenti PNG (g1 dalla versione ritagliata, senza la cassetta).
const sources = { g1: "/tmp/claude-g1-top.jpg", g2: "../materiali/immagini/g2.png", g3: "../materiali/immagini/g3.png", g4: "../materiali/immagini/g4.png", g5: "../materiali/immagini/g5.png", g6: "../materiali/immagini/g6.png" };
const dims = {};
for (const [k, src] of Object.entries(sources)) {
  if (!existsSync(src)) { console.warn(`manca ${src}`); continue; }
  const big = await out(src, `public/img/${k}.jpg`, 1600, "jpeg", 80);
  await out(src, `public/img/${k}-800.jpg`, 800, "jpeg", 78);
  await out(src, `public/img/${k}.webp`, 1600, "webp", 78);
  await out(src, `public/img/${k}-800.webp`, 800, "webp", 78);
  dims[k] = [big.width, big.height];
}
console.log("misure:", JSON.stringify(dims));

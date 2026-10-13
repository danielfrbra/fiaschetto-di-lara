// "Grading" di una foto vera per avvicinarla allo stile del sito: toni caldi, colori un po' sgonfiati,
// neri alzati, una leggera vignetta e una velatura vinaccia. Poi le solite quattro varianti (JPEG/WebP, 1600/800).
//   node tools/grade.mjs <foto> <chiave>     → public/img/<chiave>.jpg, -800.jpg, .webp, -800.webp
import sharp from "sharp";

const [src, key] = process.argv.slice(2);
if (!src || !key) { console.error("uso: node tools/grade.mjs <foto> <chiave>"); process.exit(1); }

const base = sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true });
const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);

// vignetta: chiaro al centro, un po' più scuro ai bordi (moltiplica)
const vignette = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="g" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#b9a898"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/></svg>`);
// velatura vinaccia, leggera
const vino = { create: { width, height, channels: 4, background: { r: 107, g: 26, b: 43, alpha: 0.14 } } };

const graded = await base
  .modulate({ saturation: 0.8, brightness: 0.97 })
  // più caldo: un filo di rosso in più, un po' di blu in meno
  .recomb([[1.05, 0.03, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 0.9]])
  // neri alzati e contrasto morbido
  .linear(0.94, 14)
  .composite([{ input: vignette, blend: "multiply" }, { input: await sharp(vino).png().toBuffer(), blend: "soft-light" }])
  .toBuffer();

const out = async (dest, w, fmt, q) => {
  const img = sharp(graded).resize({ width: w, withoutEnlargement: true });
  const r = fmt === "webp" ? await img.webp({ quality: q }).toFile(dest) : await img.jpeg({ quality: q, mozjpeg: true }).toFile(dest);
  console.log(`${dest}  ${r.width}x${r.height}  ${Math.round(r.size / 1024)} KB`);
  return r;
};
const big = await out(`public/img/${key}.jpg`, 1600, "jpeg", 80);
await out(`public/img/${key}-800.jpg`, 800, "jpeg", 78);
await out(`public/img/${key}.webp`, 1600, "webp", 78);
await out(`public/img/${key}-800.webp`, 800, "webp", 78);
console.log(`misure: ${big.width}x${big.height}`);

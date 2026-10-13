/**
 * Galleria curata (niente feed Instagram: nessuna richiesta a terzi).
 * Immagini generate dai prompt in docs/brief-immagini.md e preparate con
 * tools/images.mjs in due misure (1600 e 800 px) e due formati (WebP + JPEG):
 * il browser sceglie la più adatta. Quando arriveranno le foto vere, basta
 * sostituire le sorgenti in ../materiali/immagini, rilanciare lo script e
 * aggiornare le misure qui. `src: null` = placeholder.
 */
export interface Shot {
  src: string | null;      // JPEG 1600
  small: string | null;    // JPEG 800
  webp: boolean;           // esistono anche .webp con lo stesso nome
  w: number;
  h: number;
  key: string;             // chiave i18n della didascalia/alt
  ratio: "3/2" | "4/5" | "1/1";
}

const shot = (k: string, w: number, h: number, ratio: Shot["ratio"]): Shot => ({
  src: `/img/${k}.jpg`, small: `/img/${k}-800.jpg`, webp: true, w, h, key: k, ratio,
});

export const GALLERY: Shot[] = [
  shot("g1", 1508, 1006, "3/2"),
  shot("g2", 1600, 1067, "3/2"),
  shot("g3", 1600, 1600, "1/1"),
  shot("g4", 1600, 1067, "3/2"),
  shot("g5", 1536, 2048, "4/5"),
  shot("g6", 1600, 1600, "1/1"),
];

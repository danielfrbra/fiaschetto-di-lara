/**
 * Galleria curata (niente feed Instagram: nessuna richiesta a terzi).
 * Immagini: g2, g4, g5, g6 generate dai prompt in docs/brief-immagini.md; g3 foto vera
 * da TripAdvisor; g1 e g7-g12 foto vere dall'Instagram della bottega (../materiali/immagini/Instagram),
 * tutte le vere trattate con tools/grade.mjs per stare nei toni del sito; preparate con
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
  ratio: "3/2" | "4/5" | "1/1" | "4/3" | "3/4";
}

const shot = (k: string, w: number, h: number, ratio: Shot["ratio"]): Shot => ({
  src: `/img/${k}.jpg`, small: `/img/${k}-800.jpg`, webp: true, w, h, key: k, ratio,
});

export const GALLERY: Shot[] = [
  shot("g1", 1440, 1080, "4/3"),   // foto vera (Instagram): la vetrina
  shot("g2", 1600, 1067, "3/2"),
  shot("g3", 1600, 1208, "4/3"),   // foto vera (TripAdvisor), trattata con tools/grade.mjs
  shot("g4", 1600, 1067, "3/2"),
  shot("g5", 1536, 2048, "4/5"),
  shot("g6", 1600, 1600, "1/1"),
  shot("g7", 1440, 1090, "4/3"),   // foto vera (Instagram)
  shot("g8", 1440, 1920, "3/4"),   // foto vera (Instagram)
  shot("g9", 1440, 1920, "3/4"),   // foto vera (Instagram)
  shot("g10", 1440, 1920, "3/4"),   // foto vera (Instagram)
  shot("g11", 1440, 1920, "3/4"),   // foto vera (Instagram)
  shot("g12", 1440, 1080, "4/3"),   // foto vera (Instagram)
];

/**
 * Galleria curata (niente feed Instagram: nessuna richiesta a terzi).
 * Immagini generate dai prompt in docs/brief-immagini.md e convertite con sips
 * in due misure (1600 e 800 px, JPEG): il browser sceglie quella giusta.
 * Quando arriveranno le foto vere, basta sostituire i file in public/img/ e le misure qui.
 * `src: null` = immagine non disponibile, si vede un placeholder.
 */
export interface Shot {
  src: string | null;
  /** versione piccola, per telefoni e griglie strette */
  small: string | null;
  /** misure della versione grande: riservano lo spazio prima che l'immagine arrivi */
  w: number;
  h: number;
  /** chiave i18n della didascalia/alt */
  key: string;
  /** proporzione, per riservare lo spazio prima che l'immagine arrivi */
  ratio: "3/2" | "4/5" | "1/1";
}

export const GALLERY: Shot[] = [
  { src: "/img/g1.jpg", small: "/img/g1-800.jpg", w: 1600, h: 1067, key: "g1", ratio: "3/2" },
  { src: "/img/g2.jpg", small: "/img/g2-800.jpg", w: 1600, h: 1066, key: "g2", ratio: "3/2" },
  { src: "/img/g3.jpg", small: "/img/g3-800.jpg", w: 1600, h: 1600, key: "g3", ratio: "1/1" },
  { src: "/img/g4.jpg", small: "/img/g4-800.jpg", w: 1600, h: 1066, key: "g4", ratio: "3/2" },
  { src: "/img/g5.jpg", small: "/img/g5-800.jpg", w: 1200, h: 1600, key: "g5", ratio: "4/5" },
  { src: "/img/g6.jpg", small: "/img/g6-800.jpg", w: 1600, h: 1600, key: "g6", ratio: "1/1" },
];

/**
 * Galleria curata (niente feed Instagram: nessuna richiesta a terzi).
 * `src: null` = immagine non ancora disponibile, si vede un placeholder.
 * I prompt per generarle stanno in docs/brief-immagini.md; le foto vere, quando ci saranno, le sostituiscono.
 */
export interface Shot {
  src: string | null;
  /** chiave i18n della didascalia/alt */
  key: string;
  /** proporzione, per riservare lo spazio prima che l'immagine arrivi */
  ratio: "3/2" | "4/5" | "1/1";
}

export const GALLERY: Shot[] = [
  { src: null, key: "g1", ratio: "4/5" },
  { src: null, key: "g2", ratio: "3/2" },
  { src: null, key: "g3", ratio: "1/1" },
  { src: null, key: "g4", ratio: "3/2" },
  { src: null, key: "g5", ratio: "4/5" },
  { src: null, key: "g6", ratio: "1/1" },
];

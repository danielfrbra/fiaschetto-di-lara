/**
 * Galleria curata (niente feed Instagram: nessuna richiesta a terzi).
 * Tredici tessere, scelte con Daniel il 2026-10-14: foto vere dall'Instagram della
 * bottega e dalla scheda TripAdvisor (queste ultime sono piccole, 550 px, e dell'era
 * Conti: niente prezzi, niente volti), più due immagini generate d'atmosfera (tagliere, olio).
 * Tutte le foto vere passano da tools/grade.mjs (toni del sito); le varianti -800 e .webp
 * le fa lo stesso script. Le didascalie sono in i18n (gallery.*): corte, giocose, vere.
 * `src: null` = placeholder.
 */
export interface Shot {
  src: string | null;      // JPEG grande
  small: string | null;    // JPEG 800 (null se la foto è già piccola)
  webp: boolean;           // esistono anche .webp con lo stesso nome
  w: number;
  h: number;
  key: string;             // chiave i18n della didascalia/alt
  ratio: "3/2" | "4/5" | "1/1" | "4/3" | "3/4";
}

export const GALLERY: Shot[] = [
  { src: "/img/g15.jpg", small: null, webp: true, w: 550, h: 353, key: "g15", ratio: "3/2" },   // foto vera (TripAdvisor): il negozio dall'esterno
  { src: "/img/g7.jpg", small: "/img/g7-800.jpg", webp: true, w: 1440, h: 1090, key: "g7", ratio: "4/3" },   // foto vera (Instagram): bancone e sgabelli
  { src: "/img/g13.jpg", small: null, webp: true, w: 550, h: 449, key: "g13", ratio: "4/3" },   // foto vera (TripAdvisor): i fiaschi
  { src: "/img/g3.jpg", small: "/img/g3-800.jpg", webp: true, w: 1600, h: 1208, key: "g3", ratio: "4/3" },   // foto vera (TripAdvisor): gli scaffali
  { src: "/img/g17.jpg", small: null, webp: true, w: 550, h: 412, key: "g17", ratio: "4/3" },   // foto vera (TripAdvisor): le vasche dello sfuso
  { src: "/img/g4.jpg", small: "/img/g4-800.jpg", webp: true, w: 1600, h: 1067, key: "g4", ratio: "3/2" },   // generata: il tagliere
  { src: "/img/g18.jpg", small: null, webp: true, w: 550, h: 412, key: "g18", ratio: "4/3" },   // foto vera (TripAdvisor): le vigne a due km, senza cielo
  { src: "/img/g16.jpg", small: null, webp: true, w: 337, h: 450, key: "g16", ratio: "4/5" },   // foto vera (TripAdvisor): la dispensa
  { src: "/img/g11.jpg", small: "/img/g11-800.jpg", webp: true, w: 1440, h: 1920, key: "g11", ratio: "4/5" },   // foto vera (Instagram): un bianco al tramonto
  { src: "/img/g14.jpg", small: null, webp: true, w: 550, h: 412, key: "g14", ratio: "4/3" },   // foto vera (TripAdvisor): d'inverno, con le luci
  { src: "/img/g6.jpg", small: "/img/g6-800.jpg", webp: true, w: 1600, h: 1600, key: "g6", ratio: "1/1" },   // generata: l'olio
  { src: "/img/g19.jpg", small: null, webp: true, w: 550, h: 412, key: "g19", ratio: "4/3" },   // foto vera (TripAdvisor): i filari
  { src: "/img/g20.jpg", small: null, webp: true, w: 550, h: 389, key: "g20", ratio: "4/3" },   // foto vera (TripAdvisor): le grappe
];

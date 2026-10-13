import type { Lang } from "../i18n";

const MONTHS: Record<Lang, string[]> = {
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const WEEKDAYS: Record<Lang, string[]> = {
  it: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

/** Lavoriamo sulle PARTI della data (anno, mese, giorno), mai su Date con fuso: così la build su Netlify (UTC) e il Mac danno lo stesso risultato. */
export function dateParts(date: string, lang: Lang) {
  const [y, m, d] = date.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return {
    day: d,
    month: MONTHS[lang][m - 1],
    monthShort: MONTHS[lang][m - 1].slice(0, 3),
    weekday: WEEKDAYS[lang][wd],
    year: y,
  };
}

export function fmtLong(date: string, lang: Lang): string {
  const p = dateParts(date, lang);
  return `${p.weekday} ${p.day} ${p.month} ${p.year}`;
}

export function fmtShort(date: string, lang: Lang): string {
  const p = dateParts(date, lang);
  return `${p.day} ${p.month}`;
}

export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function fmtMonth(key: string, lang: Lang): string {
  const [y, m] = key.split("-").map(Number);
  const name = MONTHS[lang][m - 1];
  return `${name[0].toUpperCase()}${name.slice(1)} ${y}`;
}

/** Periodo leggibile: "sabato 17 ottobre" oppure "10–18 ottobre" oppure "30 novembre – 6 gennaio". */
export function fmtRange(start: string, end: string, lang: Lang): string {
  if (start === end) return fmtLong(start, lang);
  const a = dateParts(start, lang), b = dateParts(end, lang);
  if (a.month === b.month && a.year === b.year) return `${a.day}–${b.day} ${a.month} ${a.year}`;
  return `${a.day} ${a.month} – ${b.day} ${b.month} ${b.year}`;
}

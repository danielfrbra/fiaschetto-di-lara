/**
 * Motore eventi: legge le due fonti in fase di build, le unisce, tiene solo
 * gli appuntamenti futuri e li ordina. Se una fonte non risponde, il sito si
 * costruisce lo stesso con quello che c'è (e lo scrive nei log della build).
 */
import { EVENT_SOURCES } from "../config/events";
import { parseIcal, parseIcalDate, unescapeIcal, stripHtml } from "./ical";
import { parseCsv } from "./csv";

export type Source = "fiaschetto" | "associazione" | "paese";

export interface Ev {
  slug: string;
  title: string;
  titleEn: string | null;
  date: string;      // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD (incluso)
  time: string | null;    // HH:MM
  endTime: string | null;
  location: string | null;
  description: string | null;
  descriptionEn: string | null;
  url: string | null;
  image: string | null;
  organizer: string | null;
  source: Source;
}

export function todayRome(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export function slugify(s: string): string {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Scarica una fonte. Se va bene, ne tiene una copia in node_modules/.cache
 * (Netlify conserva quella cartella fra una build e l'altra); se la fonte non
 * risponde, usa l'ultima copia buona. Così un sito del Comune in panne per un
 * giorno non svuota il calendario.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const CACHE_DIR = join(process.cwd(), "node_modules", ".cache", "fiaschetto");

async function fetchText(url: string, label: string, cacheName: string): Promise<string | null> {
  const cacheFile = join(CACHE_DIR, cacheName);
  try {
    const r = await fetch(url, { headers: { "User-Agent": "fiaschetto-di-lara (build)" } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    try { mkdirSync(CACHE_DIR, { recursive: true }); writeFileSync(cacheFile, text); } catch { /* la cache è un di più */ }
    return text;
  } catch (e) {
    try {
      const old = readFileSync(cacheFile, "utf8");
      console.warn(`[eventi] ${label}: non raggiungibile (${(e as Error).message}). Uso l'ultima copia buona.`);
      return old;
    } catch {
      console.warn(`[eventi] ${label}: non raggiungibile (${(e as Error).message}) e nessuna copia precedente. Si continua senza.`);
      return null;
    }
  }
}

const clean = (s: string | undefined | null) => (s ?? "").trim() || null;

/**
 * Il feed del Comune scrive i luoghi come "Piazza del Popolo, Piazza del Popolo, Montespertoli, Seleziona uno Stato:, 50025, Italia".
 * Teniamo solo le parti utili, senza doppioni: "Piazza del Popolo, Montespertoli".
 */
function cleanLocation(s: string | null): string | null {
  if (!s) return null;
  const out: string[] = [];
  for (const raw of s.split(/\s*,\s*/)) {
    const p = raw.trim();
    if (!p || /^seleziona/i.test(p) || /^(italy|italia)$/i.test(p) || /^\d{5}$/.test(p)) continue;
    if (out.some((o) => o.toLowerCase() === p.toLowerCase())) continue;
    out.push(p);
  }
  return out.join(", ") || null;
}

/* ——— Fonte 1: calendario del Comune (iCal) ——— */
function fromComune(text: string): Ev[] {
  const out: Ev[] = [];
  for (const ev of parseIcal(text)) {
    const start = parseIcalDate(ev.DTSTART);
    if (!start) continue;
    const title = clean(unescapeIcal(ev.SUMMARY?.value ?? ""));
    if (!title) continue;
    let end = parseIcalDate(ev.DTEND);
    let endDate = end?.date ?? start.date;
    // Negli eventi "tutto il giorno" la fine iCal è esclusiva: 18→19 vuol dire "il 18".
    if (end && !start.time && end.date > start.date) {
      const d = new Date(Date.UTC(+end.date.slice(0, 4), +end.date.slice(5, 7) - 1, +end.date.slice(8, 10)));
      d.setUTCDate(d.getUTCDate() - 1);
      endDate = d.toISOString().slice(0, 10);
    }
    if (endDate < start.date) endDate = start.date;
    const desc = ev.DESCRIPTION ? stripHtml(unescapeIcal(ev.DESCRIPTION.value)) : "";
    out.push({
      slug: `${start.date}-${slugify(title)}`,
      title,
      titleEn: null,
      date: start.date,
      endDate,
      time: start.time,
      endTime: end?.time ?? null,
      location: cleanLocation(clean(unescapeIcal(ev.LOCATION?.value ?? ""))),
      description: clean(desc.length > 700 ? desc.slice(0, 700).replace(/\s+\S*$/, "") + "…" : desc),
      descriptionEn: null,
      url: clean(ev.URL?.value),
      image: null,
      organizer: null,
      source: "paese",
    });
  }
  return out;
}

/* ——— Fonte 2: foglio Google di Lara (CSV) ——— */
function parseSheetDate(s: string): string | null {
  const v = s.trim();
  let m = v.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
  if (m) {
    const y = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  }
  m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return null;
}
function parseSheetTime(s: string): string | null {
  const m = s.trim().match(/^(\d{1,2})(?:[:.,h](\d{2}))?/);
  if (!m) return null;
  const h = +m[1];
  if (h > 23) return null;
  return `${String(h).padStart(2, "0")}:${m[2] ?? "00"}`;
}
function sourceOf(organizer: string | null): Source {
  const o = (organizer ?? "").toLowerCase();
  if (o.includes("fiaschetto")) return "fiaschetto";
  if (o.includes("associazione") || o.includes("commercianti")) return "associazione";
  return "paese";
}

function fromSheet(text: string): Ev[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  // Le colonne si riconoscono dal nome, non dalla posizione: Lara può spostarle.
  const col = (...names: string[]) => header.findIndex((h) => names.some((n) => h === n || h.startsWith(n)));
  const cTitle = col("titolo"), cDate = col("data"), cTime = col("ora"), cEndDate = col("data fine", "fine"),
    cEndTime = col("ora fine"), cPlace = col("luogo", "dove"), cDesc = col("descrizione"), cLink = col("link"),
    cPhoto = col("foto", "immagine"), cOrg = col("chi organizza", "organizza"), cTitleEn = col("titolo in inglese", "titolo (en)", "title"),
    cDescEn = col("descrizione in inglese", "descrizione (en)", "description");
  const out: Ev[] = [];
  for (const r of rows.slice(1)) {
    const get = (i: number) => (i >= 0 ? clean(r[i]) : null);
    const title = get(cTitle);
    const date = cDate >= 0 ? parseSheetDate(r[cDate] ?? "") : null;
    if (!title || !date) continue;
    const endDate = (cEndDate >= 0 && cEndDate !== cDate ? parseSheetDate(r[cEndDate] ?? "") : null) ?? date;
    const organizer = get(cOrg);
    out.push({
      slug: `${date}-${slugify(title)}`,
      title,
      titleEn: get(cTitleEn),
      date,
      endDate: endDate < date ? date : endDate,
      time: cTime >= 0 ? parseSheetTime(r[cTime] ?? "") : null,
      endTime: cEndTime >= 0 && cEndTime !== cTime ? parseSheetTime(r[cEndTime] ?? "") : null,
      location: get(cPlace),
      description: get(cDesc),
      descriptionEn: get(cDescEn),
      url: get(cLink),
      image: get(cPhoto),
      organizer,
      source: sourceOf(organizer),
    });
  }
  return out;
}

/* ——— Unione ——— */
const STOP = new Set(["di", "del", "della", "dell", "dello", "dei", "degli", "delle", "sul", "sull", "sulla", "e", "ed", "in", "a", "al", "alla", "il", "la", "le", "lo", "i", "gli", "un", "una", "per", "con", "da", "the", "of", "and"]);
function tokens(title: string): Set<string> {
  return new Set(
    title.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP.has(w))
  );
}
/** Stesso giorno e titoli che si sovrappongono per almeno tre quarti delle parole significative. */
function sameEvent(a: Ev, b: Ev): boolean {
  if (a.date !== b.date) return false;
  const ta = tokens(a.title), tb = tokens(b.title);
  if (!ta.size || !tb.size) return false;
  let common = 0;
  for (const w of ta) if (tb.has(w)) common++;
  return common / Math.min(ta.size, tb.size) >= 0.75;
}
let cache: Promise<Ev[]> | null = null;

export function loadEvents(): Promise<Ev[]> {
  if (!cache) cache = load();
  return cache;
}

async function load(): Promise<Ev[]> {
  const [sheetText, icalText] = await Promise.all([
    fetchText(EVENT_SOURCES.sheetCsv(EVENT_SOURCES.sheetId), "foglio Google", "foglio.csv"),
    fetchText(EVENT_SOURCES.comuneIcal, "calendario del Comune", "comune.ics"),
  ]);
  const own = sheetText ? fromSheet(sheetText) : [];
  const town = icalText ? fromComune(icalText) : [];
  const today = todayRome();

  // Gli eventi di Lara vincono: se il Comune ha lo stesso evento lo stesso giorno
  // (titolo uguale o quasi: "Halloween" / "Halloween in piazza"), teniamo la versione di Lara.
  const merged = [...own, ...town.filter((e) => !own.some((o) => sameEvent(o, e)))]
    .filter((e) => e.endDate >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? "") || a.title.localeCompare(b.title));

  // Due eventi diversi con lo stesso slug (raro): il secondo prende un suffisso.
  const used = new Map<string, number>();
  for (const e of merged) {
    const n = (used.get(e.slug) ?? 0) + 1;
    used.set(e.slug, n);
    if (n > 1) e.slug = `${e.slug}-${n}`;
  }
  console.log(`[eventi] ${own.length} dal foglio di Lara, ${town.length} dal Comune → ${merged.length} in programma da oggi (${today}).`);
  return merged;
}

/* ——— Esportazioni calendario ——— */
const compact = (date: string, time: string | null) => date.replace(/-/g, "") + (time ? `T${time.replace(":", "")}00` : "");
/** Se c'è l'ora di inizio ma non quella di fine, nel calendario l'evento dura due ore: meglio di un evento lungo zero minuti. */
const endTimeOf = (e: Ev): string | null => {
  if (!e.time) return null;
  if (e.endTime) return e.endTime;
  const h = Math.min(23, +e.time.slice(0, 2) + 2);
  return `${String(h).padStart(2, "0")}:${e.time.slice(3, 5)}`;
};
const nextDay = (date: string) => {
  const d = new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10)));
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function gcalUrl(e: Ev, pageUrl: string, lang: "it" | "en" = "it"): string {
  const title = lang === "en" && e.titleEn ? e.titleEn : e.title;
  const dates = e.time
    ? `${compact(e.date, e.time)}/${compact(e.endDate, endTimeOf(e))}`
    : `${compact(e.date, null)}/${compact(nextDay(e.endDate), null)}`;
  const p = new URLSearchParams({ action: "TEMPLATE", text: title, dates, ctz: "Europe/Rome", details: pageUrl });
  if (e.location) p.set("location", e.location);
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function toIcs(e: Ev, pageUrl: string): string {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Il Fiaschetto di Lara//Eventi//IT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@fiaschetto-di-lara`,
    `DTSTAMP:${stamp}`,
    e.time ? `DTSTART;TZID=Europe/Rome:${compact(e.date, e.time)}` : `DTSTART;VALUE=DATE:${compact(e.date, null)}`,
    e.time ? `DTEND;TZID=Europe/Rome:${compact(e.endDate, endTimeOf(e))}` : `DTEND;VALUE=DATE:${compact(nextDay(e.endDate), null)}`,
    `SUMMARY:${esc(e.title)}`,
    `URL:${pageUrl}`,
  ];
  if (e.location) lines.push(`LOCATION:${esc(e.location)}`);
  if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

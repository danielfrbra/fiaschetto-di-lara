/** Lettore iCal minimo, senza dipendenze: basta per il feed del Comune. */
export interface IcalProp {
  value: string;
  params: Record<string, string>;
}
export type IcalEvent = Record<string, IcalProp>;

export function parseIcal(text: string): IcalEvent[] {
  // Le righe lunghe sono "piegate": una riga che inizia con spazio continua la precedente.
  const unfolded = text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
  const out: IcalEvent[] = [];
  let cur: IcalEvent | null = null;
  for (const line of unfolded.split("\n")) {
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT") { if (cur) out.push(cur); cur = null; continue; }
    if (!cur) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const [name, ...rawParams] = line.slice(0, i).split(";");
    const params: Record<string, string> = {};
    for (const p of rawParams) {
      const j = p.indexOf("=");
      if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, "");
    }
    cur[name.toUpperCase()] = { value: line.slice(i + 1), params };
  }
  return out;
}

export function unescapeIcal(s: string): string {
  return s.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\;/g, ";").replace(/\\\\/g, "\\");
}

/** "20261017T173000" | "20261018" → { date: "2026-10-17", time: "17:30" | null } */
export function parseIcalDate(p: IcalProp | undefined): { date: string; time: string | null } | null {
  if (!p) return null;
  const m = p.value.trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  if (!m[4]) return { date: `${m[1]}-${m[2]}-${m[3]}`, time: null };
  if (m[7] === "Z") {
    // Orario UTC: lo riportiamo all'ora italiana.
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)));
    const f = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(d);
    const g = (t: string) => f.find((x) => x.type === t)?.value ?? "00";
    return { date: `${g("year")}-${g("month")}-${g("day")}`, time: `${g("hour")}:${g("minute")}` };
  }
  // Il feed del Comune dichiara TZID=Europe/Rome: l'orario è già quello italiano.
  return { date: `${m[1]}-${m[2]}-${m[3]}`, time: `${m[4]}:${m[5]}` };
}

const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "\u2019", lsquo: "\u2018", ldquo: "\u201c", rdquo: "\u201d", hellip: "\u2026",
  ndash: "\u2013", mdash: "\u2014", eacute: "é", egrave: "è", agrave: "à", ograve: "ò", ugrave: "ù", igrave: "ì",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** Via i tag HTML, dentro restano solo testo e a capo. */
export function stripHtml(s: string): string {
  return decodeEntities(
    s.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h\d)>/gi, "\n").replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

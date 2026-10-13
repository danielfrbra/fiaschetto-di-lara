import it from "./it.json";
import en from "./en.json";

export type Lang = "it" | "en";
export type PageKey = "home" | "events" | "event" | "privacy";

export const LANGS: Lang[] = ["it", "en"];
export const LANG_LABELS: Record<Lang, string> = { it: "Italiano", en: "English" };
export const HREFLANG: Record<Lang, string> = { it: "it", en: "en" };

const DICT: Record<Lang, unknown> = { it, en };

/** Home di ciascuna lingua: l'italiano sta alla radice, l'inglese sotto /en/. Tutti gli indirizzi finiscono con la barra (vedi astro.config.mjs). */
export const home = (l: Lang) => (l === "it" ? "/" : "/en/");
/** Prefisso per costruire gli altri indirizzi ("" per l'italiano, "/en" per l'inglese). */
export const prefix = (l: Lang) => (l === "it" ? "" : "/en");

export const PATHS = {
  events: { it: "/eventi/", en: "/en/events/" } as Record<Lang, string>,
  privacy: { it: "/privacy/", en: "/en/privacy/" } as Record<Lang, string>,
};
export const eventPath = (l: Lang, slug: string) => `${PATHS.events[l]}${slug}/`;
/** Il file calendario dell'evento: stesso indirizzo, senza barra e con .ics. */
export const eventIcs = (l: Lang, slug: string) => `${PATHS.events[l]}${slug}.ics`;

/** Ancora a una sezione della home, da qualunque pagina. */
export const homeAnchor = (l: Lang, id: string, onHome: boolean) =>
  onHome ? `#${id}` : `${prefix(l)}/#${id}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useT(lang: Lang): (key: string) => any {
  return (key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = key.split(".").reduce<any>((o, k) => (o == null ? undefined : o[k]), DICT[lang]);
    if (v === undefined) throw new Error(`i18n: chiave mancante "${key}" (${lang})`);
    return v;
  };
}

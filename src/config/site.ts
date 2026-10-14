/**
 * Dati della bottega. Tutto quello che è "un fatto" sta qui, non nei testi:
 * si cambia in un posto solo e vale per tutte le pagine e le due lingue.
 */
export const SITE = {
  name: "Il Fiaschetto di Lara",
  shortName: "Il Fiaschetto",
  owner: "Lara Bartalucci",
  address: {
    street: "Via Garibaldi 4-6",
    cap: "50025",
    town: "Montespertoli",
    prov: "FI",
    region: "Toscana",
    country: "IT",
  },
  /** Numero usato per le prenotazioni della bottega e dall'Associazione Commercianti. */
  phone: "+39 339 352 0372",
  phoneHref: "tel:+393393520372",
  whatsapp: "https://wa.me/393393520372",
  instagram: "https://www.instagram.com/il_fiaschetto_di_lara/",
  instagramHandle: "@il_fiaschetto_di_lara",
  facebook: "https://www.facebook.com/ilfiaschetto/",
  maps: "https://www.google.com/maps/search/?api=1&query=Il+Fiaschetto+Via+Garibaldi+4+Montespertoli",
  /** Via Giuseppe Garibaldi 4, Montespertoli — geocodifica OpenStreetMap (Nominatim), 2026-10-13. */
  geo: { lat: 43.64409, lng: 11.07507 },
  /** Orari comunicati da Daniel il 2026-10-14. Righe per il sito (IT/EN) e versione strutturata per Google (JSON-LD). */
  hours: {
    it: ["Lunedì 16:30 – 20:00", "Martedì – Sabato 9:30 – 12:30 e 16:30 – 20:00", "Domenica 9:30 – 12:30"],
    en: ["Monday 4:30 – 8 pm", "Tuesday – Saturday 9:30 am – 12:30 pm and 4:30 – 8 pm", "Sunday 9:30 am – 12:30 pm"],
  } as null | { it: string[]; en: string[] },
  /** Stessi orari, nel formato che Google legge (schema.org OpeningHoursSpecification). */
  openingHours: [
    { days: ["Monday"], opens: "16:30", closes: "20:00" },
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "12:30" },
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "16:30", closes: "20:00" },
    { days: ["Sunday"], opens: "09:30", closes: "12:30" },
  ],
  email: null as null | string,
};

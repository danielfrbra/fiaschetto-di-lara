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
  /** Coordinate approssimative del centro di Montespertoli: da affinare quando Lara conferma. */
  geo: { lat: 43.6432, lng: 11.0744 },
  /** null finché non li confermiamo con Lara: il sito mostra "chiedili su WhatsApp". */
  hours: null as null | { it: string[]; en: string[] },
  email: null as null | string,
};

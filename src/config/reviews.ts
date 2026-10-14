/**
 * Recensioni vere, copiate parola per parola dalla fonte indicata. La sezione
 * "Dicono di noi" compare in home solo se qui c'è almeno una voce.
 *
 * ⚠️ Niente recensioni inventate, niente recensioni dell'era Conti (le nove su
 * TripAdvisor sono del 2012-2017, prima che la bottega cambiasse mano: parlano
 * di un'altra gestione). Da riempire con recensioni recenti (Google, Facebook)
 * che Daniel o Lara copiano a mano, con nome, data e fonte.
 */
export interface Review {
  /** nome come appare nella recensione (anche solo il nome di battesimo) */
  name: string;
  /** testo, fedele all'originale; si può accorciare con "…" ma non cambiare */
  text: string;
  /** mese e anno, es. "Settembre 2026" */
  when: string;
  /** "Google" | "Facebook" | "TripAdvisor" */
  source: "Google" | "Facebook" | "TripAdvisor";
  /** stelle, 1-5 (facoltativo) */
  stars?: number;
  /** lingua del testo: se è inglese lo mostriamo senza tradurre */
  lang?: "it" | "en";
}

/*
 * Quattro recensioni Google copiate da Daniel il 2026-10-14. Le date Google le dà
 * relative ("6 mesi fa", "un anno fa"): qui sono tradotte in mese/anno approssimati.
 * I cognomi sono ridotti all'iniziale per discrezione. Niente stelle: Google non le
 * mostrava nel testo copiato (da aggiungere se Daniel le conferma).
 * La quarta è la traduzione automatica di Google di un originale inglese.
 */
export const REVIEWS: Review[] = [
  {
    name: "Iuliana O.",
    text: "Se cerchi la Toscana autentica, quella delle botteghe dove il rapporto umano conta quanto il vino buono, devi andare da Lara. Qui a Montespertoli la qualità dello sfuso va di pari passo con un'accoglienza che non si trova più. Lara conosce ogni etichetta e ti consiglia con passione e sincerità. Entri per una bottiglia e ne esci proprio rigenerato.",
    when: "Aprile 2026",
    source: "Google",
    lang: "it",
  },
  {
    name: "Guido B.",
    text: "Ottima selezione di vini e prodotti del territorio. Proprietaria cordiale e competente. Consigliatissimo",
    when: "Novembre 2025",
    source: "Google",
    lang: "it",
  },
  {
    name: "Silvia F.",
    text: "Proprietari simpatici e molto preparati sulle caratteristiche dei vini in vendita, attenti alle esigenze del cliente…",
    when: "2025",
    source: "Google",
    lang: "it",
  },
  {
    name: "Kurt S.",
    text: "Proprietario gentilissimo con un'ampia varietà di vini e aperitivi. Abbiamo gustato il prosecco all'aperto e siamo stati viziati con piccoli snack locali fatti in casa.",
    when: "2025",
    source: "Google",
    lang: "it",
  },
];

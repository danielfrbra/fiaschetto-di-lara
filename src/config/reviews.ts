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
  /** lingua del testo originale */
  lang?: "it" | "en";
  /** versione inglese per il sito EN (tradotta da noi, segnalata come tale) */
  textEn?: string;
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
    textEn: "If you're looking for the authentic Tuscany, the one of small shops where the human touch counts as much as good wine, you have to go to Lara's. Here in Montespertoli the quality of the wine on tap goes hand in hand with a welcome you don't find anymore. Lara knows every label and advises you with passion and sincerity. You walk in for a bottle and walk out truly refreshed.",
    text: "Se cerchi la Toscana autentica, quella delle botteghe dove il rapporto umano conta quanto il vino buono, devi andare da Lara. Qui a Montespertoli la qualità dello sfuso va di pari passo con un'accoglienza che non si trova più. Lara conosce ogni etichetta e ti consiglia con passione e sincerità. Entri per una bottiglia e ne esci proprio rigenerato.",
    when: "Aprile 2026",
    source: "Google",
    lang: "it",
  },
  {
    name: "Guido B.",
    textEn: "Excellent selection of wines and local products. Friendly, knowledgeable owner. Highly recommended",
    text: "Ottima selezione di vini e prodotti del territorio. Proprietaria cordiale e competente. Consigliatissimo",
    when: "Novembre 2025",
    source: "Google",
    lang: "it",
  },
  {
    name: "Silvia F.",
    textEn: "Friendly owners, very well prepared on the characteristics of the wines on sale, attentive to the customer's needs…",
    text: "Proprietari simpatici e molto preparati sulle caratteristiche dei vini in vendita, attenti alle esigenze del cliente…",
    when: "2025",
    source: "Google",
    lang: "it",
  },
  {
    name: "Kurt S.",
    textEn: "Very kind owner with a wide variety of wines and aperitifs. We enjoyed the prosecco outdoors and were spoiled with small homemade local snacks.",
    text: "Proprietario gentilissimo con un'ampia varietà di vini e aperitivi. Abbiamo gustato il prosecco all'aperto e siamo stati viziati con piccoli snack locali fatti in casa.",
    when: "2025",
    source: "Google",
    lang: "it",
  },
];

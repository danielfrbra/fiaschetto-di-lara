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

export const REVIEWS: Review[] = [];

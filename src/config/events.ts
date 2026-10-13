/** Da dove arrivano gli eventi. Entrambe le fonti si leggono in fase di build. */
export const EVENT_SOURCES = {
  /** Calendario pubblico del Comune di Montespertoli (feed iCal di visitmontespertoli.it). */
  comuneIcal: "https://visitmontespertoli.it/events/?ical=1",
  /** Foglio Google compilato da Lara: condiviso "chiunque abbia il link". Si legge come CSV. */
  sheetId: "1HNamOMAtPWoc-KCwCQ_xVRd4LX-uIAcoLrycWSfQZgs",
  sheetCsv: (id: string) => `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`,
};

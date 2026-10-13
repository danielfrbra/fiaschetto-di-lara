# CLAUDE.md — fiaschetto-di-lara

## Identità del progetto

Sito vetrina de **Il Fiaschetto di Lara**: bottega del vino nel centro storico di Montespertoli (Via Garibaldi 4-6), vino sfuso dei produttori del paese, bottiglie, un bicchiere sul posto. La titolare, **Lara Bartalucci**, è anche presidente dell'Associazione Commercianti e Artigiani di Montespertoli e promuove quasi tutti gli eventi del paese: per questo il sito ha due anime, **la bottega e la bacheca del paese**.

Il sito è un **regalo** di Daniel a Lara, costruito **a sorpresa** (lei non sa nulla, niente richieste di foto o orari). Serve a farle vedere la qualità del servizio "siti web" che poi lei potrà proporre alle altre attività del paese. La qualità percepita è il prodotto.

**Progetto totalmente indipendente** da aipim-website e quolab-website: repository proprio (`danielfrbra/fiaschetto-di-lara`), sito Netlify proprio, nessuna variabile, chiave, link o dominio in comune. Si riusa solo il know-how.

## Comunicazione con Daniel (project owner)

- Sempre in **italiano**, linguaggio semplice e discorsivo, partendo da cosa vede l'utente.
- **Approval-first**: analisi → proposta → ok esplicito → implementazione. Mai push/deploy/DNS senza autorizzazione.
- Commit in italiano.

## Decisioni prese (2026-10-12/13, Daniel)

1. Nome in testata **"Il Fiaschetto di Lara"** (come l'Instagram `@il_fiaschetto_di_lara`).
2. Lingue: **IT alla radice, EN sotto `/en`**. Niente altre lingue.
3. **Eventi**: due fonti lette in fase di build. (a) Foglio Google compilato da Lara (id in `src/config/events.ts`, condiviso "chiunque abbia il link", letto come CSV). (b) Feed iCal pubblico del Comune, `visitmontespertoli.it/events/?ical=1`. Gli eventi di Lara vincono sui doppioni. Ricostruzione automatica ogni mattina (`netlify/functions/rebuild.mjs` → build hook).
4. Hosting: **sottodominio Netlify** `fiaschetto-di-lara.netlify.app`. Il dominio definitivo lo comprerà Lara dopo; allora cambiare `site` in `astro.config.mjs`.
5. **Video di sfondo**: prodotti da Daniel su kling.ai dai brief in `docs/brief-video-kling.md`; finché mancano, `MediaSlot` mostra un placeholder (vinaccia che respira) presentabile anche in produzione. Registro in `src/config/media.ts`.
6. **Instagram**: galleria curata a mano (`src/config/gallery.ts`), nessun feed incorporato → nessuna richiesta a terzi, nessun cookie.
7. Stile: stessa famiglia di aipim.ai (apertura scura cinematografica, poi sezioni chiare editoriali, reveal allo scorrimento) ma palette del vino: vinaccia `#2a0b14`/`#6b1a2b`, paglia del fiasco `#e1b96b`, crema `#f7f1e6`. Font **Fraunces** (titoli, variabile, "SOFT"+"WONK") e **Instrument Sans** (testo), ospitati in `public/fonts/`.

## Cose che non sappiamo ancora (sorpresa: non si chiede a Lara)

- **Orari di apertura**: `SITE.hours = null` → il sito dice "chiedili su WhatsApp". Quando si sapranno, riempire `hours` in `src/config/site.ts` (IT ed EN) e il JSON-LD li prenderà da lì.
- **Email**: nessuna. Il canale è WhatsApp sul **339 352 0372** (numero usato per le prenotazioni della bottega e dall'Associazione, pubblicato nei comunicati del Comune).
- **Coordinate**: approssimate al centro del paese. Affinare.
- I produttori elencati nella sezione "Il territorio" sono quelli del territorio (dal programma Chianti Lovers Week 2025), **non** una promessa di cosa c'è in bottega: il testo lo dice ("alcuni dei produttori del territorio"). Non trasformarlo in un listino.
- Le recensioni e i telefoni vecchi online (TripAdvisor 2014, Expedia, 347… / 333…) sono dell'era Conti: non usarli.

## Foglio Google degli eventi — formato

Prima riga = intestazioni. Le colonne si riconoscono dal **nome**, non dalla posizione (Lara può spostarle):

| Titolo | Data | Ora | Data fine | Ora fine | Luogo | Descrizione | Link | Foto | Chi organizza | Titolo in inglese | Descrizione in inglese |
|---|---|---|---|---|---|---|---|---|---|---|---|

- `Data` in `gg/mm/aaaa` (vale anche `gg/mm/aa` o `aaaa-mm-gg`). `Ora` in `hh:mm` (vale anche `20.30` o `20`).
- `Chi organizza`: se contiene "Fiaschetto" → etichetta rossa "Il Fiaschetto"; se contiene "Associazione" o "Commercianti" → etichetta paglia; altrimenti "In paese".
- Le righe senza titolo o senza data valida vengono ignorate. Gli eventi passati spariscono da soli.
- Un evento di Lara con lo stesso titolo lo stesso giorno di uno del Comune **sostituisce** quello del Comune.

**Ricostruzione istantanea (facoltativa, non ancora attiva):** nel foglio, Estensioni → Apps Script, incollare

```js
function onChange() { UrlFetchApp.fetch("<BUILD_HOOK_URL>", { method: "post" }); }
```

e aggiungere un trigger "Al cambiamento" sulla funzione. Così il sito si rifà due minuti dopo ogni modifica.

## Regole operative

- Niente segreti nel repo. L'unica variabile d'ambiente è `BUILD_HOOK_URL` sul sito Netlify.
- **Deploy di prova**: `npm run build && netlify deploy --dir=dist --message "…"` (senza `--prod`) dà un indirizzo temporaneo. Il push su `main` pubblica sul sottodominio.
- Menu e footer si cambiano in `SiteNav.astro` e `SiteFooter.astro`, mai nelle pagine.
- Ogni stringa visibile passa da `src/i18n/{it,en}.json`; `npm run check:i18n` (gira anche prima della build) ferma tutto se le chiavi non combaciano.
- La build **legge internet** (foglio + iCal). Se una fonte non risponde, continua senza e lo scrive nei log: non fa fallire la build.
- `public/og.jpg` si rigenera con `swift tools/og.swift public/og.jpg` (JPEG, 79 KB: WhatsApp smette di mostrare l'anteprima sopra i 300 KB).

## Trappole note (ereditate da aipim/quolab, da evitare in partenza)

1. **Netlify Forms non registra nulla** finché il rilevamento moduli non è attivo (`processing_settings.html.ignore_html_forms = false` via API, oppure "Enable form detection" nel pannello). Sui siti nuovi è spento.
2. **Dopo un invio Netlify serve la radice**: per questo i moduli si inviano con `fetch` (`data-fetch` in `Base.astro`) e la pagina non cambia.
3. **Anteprime social in cache**: se cambia `og.jpg`, passare dal debugger di Meta e fare "Scrape Again".
4. Le funzioni programmate girano solo se il sito è **collegato a un repository** (il build hook fa partire una build su Netlify).

## Stato (aggiornare a ogni sessione)

- 2026-10-13 — **Nascita del progetto.** Scaffold Astro 5, design system, home completa (7 sezioni) in IT ed EN, motore eventi (iCal Comune + foglio Google), pagine evento con JSON-LD, .ics e condivisione, informativa privacy, funzione di ricostruzione programmata, brief video e immagini. Font ospitati in proprio, og.jpg generato. Placeholder animati al posto dei video e delle foto.

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
2. Lingue: **IT alla radice, EN sotto `/en/`**. Niente altre lingue. `trailingSlash: "always"`: Netlify serve le cartelle con la barra finale, quindi canonical e link la portano già (zero redirect).
3. **Eventi**: due fonti lette in fase di build. (a) Foglio Google compilato da Lara (id in `src/config/events.ts`, condiviso "chiunque abbia il link", letto come CSV). (b) Feed iCal pubblico del Comune, `visitmontespertoli.it/events/?ical=1`. Gli eventi di Lara vincono sui doppioni. Ricostruzione automatica ogni mattina (`netlify/functions/rebuild.mjs` → build hook).
4. Hosting: **sottodominio Netlify** `fiaschetto-di-lara.netlify.app`. Il dominio definitivo lo comprerà Lara dopo; allora cambiare `site` in `astro.config.mjs`.
5. **Video di sfondo**: prodotti da Daniel su kling.ai dai brief in `docs/brief-video-kling.md`; finché mancano, `MediaSlot` mostra un placeholder (vinaccia che respira) presentabile anche in produzione. Registro in `src/config/media.ts`.
6. **Instagram**: galleria curata a mano (`src/config/gallery.ts`), nessun feed incorporato → nessuna richiesta a terzi, nessun cookie.
7. Stile: stessa famiglia di aipim.ai (apertura scura cinematografica, poi sezioni chiare editoriali, reveal allo scorrimento) ma palette del vino: vinaccia `#2a0b14`/`#6b1a2b`, paglia del fiasco `#e1b96b`, crema `#f7f1e6`. Font **Fraunces** (titoli, variabile, "SOFT"+"WONK") e **Instrument Sans** (testo), ospitati in `public/fonts/`.

## Foto vere (dal 2026-10-13)

Dalla sera del 13/10 la galleria ha **12 tessere**: 7 foto vere dall'**Instagram della bottega** (`g1` vetrina, `g7` bancone e sgabelli, `g8`-`g12` bottiglie; sorgenti in `../materiali/immagini/Instagram`, scelte da Daniel, foto di Lara quindi senza problemi di diritti), 1 da TripAdvisor (`g3`) e 4 generate (`g2` fiaschi, `g4` tagliere, `g5` tavoli fuori, `g6` olio). Scartate: la foto con le persone (volti), quelle con lavagnette dei prezzi, la grafica promozionale con testo, le birre con etichette cartoon. La vetrina generata è stata sostituita dalla vera. Le didascalie dicono solo quello che si vede, senza nomi di produttori che non possiamo verificare. Tutte le vere passano da `tools/grade.mjs`.

La tessera `g3` è una **foto vera** dell'interno (scaffali), presa dalla scheda TripAdvisor della bottega (originale 1987x1500 in `../materiali/foto-vere/`), trattata con `tools/grade.mjs` (toni caldi, saturazione -20%, neri alzati, vignetta, velatura vinaccia) per stare con le immagini generate. ⚠️ Due cose da chiudere con Lara: (1) **diritti**: le foto su TripAdvisor sono di chi le ha caricate (probabilmente i Conti, titolari all'epoca della scheda); va bene per la sorpresa, ma prima di pubblicare col dominio suo Lara deve dire che sono della bottega o sostituirle con foto proprie; (2) **attualità**: la foto è della scheda 2013-2014 e l'interno può essere cambiato. La seconda foto TripAdvisor (damigiane dello sfuso con le lavagnette dei prezzi) **non è stata usata**: i prezzi sono del 2014 e sarebbero una bugia. L'immagine del profilo Facebook è una grafica con la frase "La vita è amara. Il vino no.", non una foto: non usata.

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

**Aggiornamento automatico dal foglio (attivo dal 2026-10-13):** la build pubblica in `/_fonti/foglio.csv` la copia del foglio con cui ha costruito il sito (integrazione `copia-foglio` in `astro.config.mjs`, dalla cache scritta da `src/lib/events.ts`). La funzione programmata `netlify/functions/controlla-foglio.mjs` ogni 5 minuti legge il foglio da Google e la copia pubblicata: se sono diversi chiama il build hook. Nessuna memoria, nessuna dipendenza, niente da installare nel Google di Lara (uno script Apps Script con trigger sarebbe legato all'account di chi lo crea e si romperebbe al passaggio del foglio a Lara). Se una delle due letture fallisce non fa nulla: ci pensa la ricostruzione del mattino. Costo: ~8.600 invocazioni al mese su 125.000 gratuite; build solo quando cambia qualcosa.

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

- 2026-10-13 (sera) — **Finalizzazione.** Video A-D prodotti da Daniel su Kling, ritagliati/compressi con `tools/video.swift` (1,3-1,7 MB l'uno) e montati; poster = primo fotogramma (`tools/poster.swift`). Sei immagini generate per la galleria, in due misure con `srcset` (g1 ritagliata alla parte alta: la cassetta in basso aveva una scritta inventata). Solo l'apertura parte subito, gli altri video si caricano quando si avvicinano allo schermo; con "riduci movimento" restano sul poster. **Verifica dei fatti sui testi**: tolti "due tavoli" (numero non verificato → "qualche tavolo"), "il paese lo adotta subito" (invenzione), "arriva Lara nel 2019" (i Conti lasciano nel 2019, fonte viniconti.eu; l'anno in cui Lara subentra non è documentato → "Cambia mano"), "la Festa del Vino: dietro c'è lei" (l'associazione siede nel comitato, non la organizza), "senza etichette da pagare", "LA bottega del vino di Montespertoli" (ce ne sono altre → "bottega del vino nel centro di"). Produttori elencati verificati uno per uno come aziende di Montespertoli. **Fonte eventi confermata**: il sito istituzionale del Comune non ha feed e rimanda esso stesso a visitmontespertoli.it per il calendario completo. Doppioni foglio/Comune uniti anche con titoli simili ("Halloween" / "Halloween in piazza", soglia 3/4 delle parole). Luoghi del feed ripuliti ("Seleziona uno Stato:", CAP, doppioni). Coordinate precise da OpenStreetMap. Guida per Lara in `docs/guida-lara.md`. **Prestazioni**: Lighthouse dava 73 su telefono (il video dell'apertura rallentava il primo disegno) → il poster dell'apertura è ora un'immagine responsive (WebP + JPEG, 800/1280 px, precaricata) e il video parte a pagina caricata; CSS tutto inline; cache lunga su `_astro`, font, media e immagini (`netlify.toml`); WebP per galleria e poster generati con `tools/images.mjs` (sharp, già dentro Astro). Accessibilità, buone pratiche e SEO: 100.

- 2026-10-13 — **Nascita del progetto.** Scaffold Astro 5, design system, home completa (7 sezioni) in IT ed EN, motore eventi (iCal Comune + foglio Google), pagine evento con JSON-LD, .ics e condivisione, informativa privacy, funzione di ricostruzione programmata, brief video e immagini. Font ospitati in proprio, og.jpg generato. Placeholder animati al posto dei video e delle foto.

## Infrastruttura (verificata il 2026-10-13)

| Cosa | Dove |
|---|---|
| Codice | `danielfrbra/fiaschetto-di-lara` (privato), branch `main` → ogni push pubblica |
| Hosting | Netlify, sito `fiaschetto-di-lara` (id `5d329620-27c9-491a-bf80-59596fbaa3cd`), account di Daniel |
| Indirizzo | https://fiaschetto-di-lara.netlify.app |
| Modulo | Netlify Forms, modulo `prenota` (rilevamento attivo); notifica email a danielfr@gmail.com (hook `submission_created`, da girare a Lara alla consegna); invio di prova del 2026-10-13 andato a buon fine |
| Ricostruzione | `rebuild` ogni giorno alle 04:00 UTC + `controlla-foglio` ogni 5 minuti se il foglio è cambiato → build hook (variabile `BUILD_HOOK_URL`) |

Collegato al repository via API con l'installazione GitHub dell'app Netlify già presente sull'account (`installation_id` 119842415). Il primo deploy è passato al primo colpo.

**Controllo visivo senza aprire il browser:** `npx astro preview & node tools/screenshot.mjs http://localhost:4321/ out.jpg 1440 900 [mobile 0/1] [clipY clipH]` — pagina intera via DevTools, con i `.reveal` già accesi.

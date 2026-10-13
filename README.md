# fiaschetto-di-lara

Sito vetrina de **Il Fiaschetto di Lara**, bottega del vino a Montespertoli (Via Garibaldi 4-6), con il calendario degli eventi del paese.

Astro puro, CSS a mano, zero dipendenze a runtime, due lingue (IT alla radice, EN sotto `/en`). Progetto **indipendente**: repository, sito Netlify e configurazione tutti propri.

## Comandi

```bash
npm install        # una volta sola
npm run dev        # anteprima su http://localhost:4321
npm run build      # controlla le chiavi i18n e genera dist/ (legge eventi da internet)
npm run preview    # serve dist/ come sarà online
```

## Struttura

```
public/            favicon.svg, og.jpg (anteprima social), fonts/, media/ (video), img/ (galleria)
src/config/        site.ts (indirizzo, telefono, social, orari), events.ts (fonti eventi), media.ts (video), gallery.ts (foto)
src/i18n/          it.json, en.json — stesse chiavi; index.ts con rotte e useT()
src/lib/           events.ts (motore eventi), ical.ts, csv.ts, dates.ts
src/layouts/       Base.astro (head, meta, hreflang, script reveal/menu/moduli)
src/components/    SiteNav, SiteFooter, Home, EventCard, EventsList, EventsPage, EventPage, Privacy, MediaSlot, FiascoMark, Icons
src/pages/         index, eventi/, privacy  +  en/ (stesse pagine in inglese); [slug].ics.ts genera i file calendario
netlify/functions/ rebuild.mjs — ricostruzione programmata ogni mattina
scripts/           check-i18n.mjs — parità delle chiavi fra le lingue
tools/             og.swift — genera public/og.jpg
docs/              brief-video-kling.md, brief-immagini.md
```

Contesto, decisioni e trappole stanno in [CLAUDE.md](CLAUDE.md).

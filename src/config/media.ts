/**
 * Registro dei video di sfondo. `src: null` = il clip non c'è ancora e il sito
 * mostra un placeholder curato. I brief per produrli stanno in docs/brief-video-kling.md.
 */
export interface Clip {
  src: string | null;
  poster: string | null;
  label: string;
}

export const MEDIA: Record<"hero" | "bottega" | "eventi" | "storia", Clip> = {
  hero: { src: null, poster: null, label: "clip A · la bottega" },
  bottega: { src: null, poster: null, label: "clip B · il fiasco" },
  eventi: { src: null, poster: null, label: "clip C · la via" },
  storia: { src: null, poster: null, label: "clip D · il carretto" },
};

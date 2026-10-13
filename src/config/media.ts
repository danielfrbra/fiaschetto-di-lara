/**
 * Registro dei video di sfondo. Prodotti da Daniel su kling.ai dai brief in
 * docs/brief-video-kling.md, poi ritagliati e compressi con tools/video.swift
 * (via il watermark, 1280x720, H.264 senza audio). I poster sono il primo
 * fotogramma di ciascun clip (tools/poster.swift), così il passaggio è invisibile.
 * `src: null` = il clip non c'è e il sito mostra un placeholder curato.
 */
export interface Clip {
  src: string | null;
  poster: string | null;
  label: string;
}

export const MEDIA: Record<"hero" | "bottega" | "eventi" | "storia", Clip> = {
  hero: { src: "/media/A.mp4", poster: "/media/posters/A.jpg", label: "clip A · la bottega" },
  bottega: { src: "/media/B.mp4", poster: "/media/posters/B.jpg", label: "clip B · il fiasco" },
  eventi: { src: "/media/C.mp4", poster: "/media/posters/C.jpg", label: "clip C · la via" },
  storia: { src: "/media/D.mp4", poster: "/media/posters/D.jpg", label: "clip D · il carretto" },
};

/**
 * Registro dei video di sfondo. Prodotti da Daniel su kling.ai dai brief in
 * docs/brief-video-kling.md, poi ritagliati e compressi con tools/video.swift
 * (via il watermark, 1280x720, H.264 senza audio). I poster sono il primo
 * fotogramma di ciascun clip (tools/poster.swift), in due misure e in WebP
 * (tools/images.mjs), così il passaggio poster → video è invisibile.
 * `src: null` = il clip non c'è e il sito mostra un placeholder curato.
 */
export interface Clip {
  src: string | null;
  /** poster grande (1280x720, JPEG) */
  poster: string | null;
  /** poster piccolo (800 px) per i telefoni */
  posterSmall: string | null;
  /** esistono anche le versioni .webp con lo stesso nome */
  webp: boolean;
  label: string;
}

const clip = (n: "A" | "B" | "C" | "D", label: string): Clip => ({
  src: `/media/${n}.mp4`,
  poster: `/media/posters/${n}.jpg`,
  posterSmall: `/media/posters/${n}-800.jpg`,
  webp: true,
  label,
});

export const MEDIA: Record<"hero" | "bottega" | "eventi" | "storia", Clip> = {
  hero: clip("A", "clip A · la bottega"),
  bottega: clip("B", "clip B · il fiasco"),
  eventi: clip("C", "clip C · la via"),
  storia: clip("D", "clip D · il carretto"),
};

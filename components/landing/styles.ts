/**
 * Style tokens for the flagship landing.
 *
 * The narrative is identical across all three (see Landing.tsx). Only the SKIN
 * changes — colors, surfaces, motion. One source of truth so the winner can be
 * promoted to `/` by copying a single token.
 */

export type Mood = "cinematic" | "calm" | "kinetic";

export interface StyleToken {
  id: string;
  name: string;
  mood: Mood;

  // Surfaces
  bg: string;        // page background
  bg2: string;       // alternate section background
  card: string;      // card surface
  cardSoft: string;  // tinted accent surface (e.g. the WhatsApp block)
  border: string;

  // Text
  text: string;      // primary / headings
  textBody: string;  // body copy
  textMuted: string; // labels, captions

  // Accent (brand sunset)
  accent: string;        // solid accent for links/labels
  accentSoft: string;    // lighter accent
  flame: string;         // primary gradient (button fills)
  onFlame: string;       // text color on top of the flame gradient

  // Hero treatment
  heroImage: boolean;    // show the mountain photo behind the hero
  heroOverlay: string;   // gradient layered over the hero
  heroBg: string;        // hero background when no image

  // Flourishes
  ctaGlow: boolean;      // pulsing glow + sheen on the hero CTA
  slowZoom: boolean;     // slow Ken-Burns zoom on hero image
  bigNumber: boolean;    // oversized "21" in the sprint section
}

const FLAME = "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)";

export const STYLE_TOKENS: Record<string, StyleToken> = {
  // v1 — Cinematic Dark: evolves today's brand. Dramatic, immersive.
  cinematic: {
    id: "cinematic",
    name: "Cinematic Dark",
    mood: "cinematic",
    bg: "#0C0C11",
    bg2: "#111119",
    card: "#15151D",
    cardSoft: "rgba(255,106,26,0.06)",
    border: "rgba(255,255,255,0.07)",
    text: "#FFFFFF",
    textBody: "#C4C4CC",
    textMuted: "#6B6B78",
    accent: "#FF8A1F",
    accentSoft: "#FFB347",
    flame: FLAME,
    onFlame: "#0C0C11",
    heroImage: true,
    heroOverlay: "linear-gradient(180deg, rgba(12,12,17,0.55) 0%, rgba(12,12,17,0.35) 45%, rgba(12,12,17,0.95) 100%)",
    heroBg: "#0C0C11",
    ctaGlow: false,
    slowZoom: true,
    bigNumber: false,
  },

  // v2 — Editorial Minimal: warm paper, huge type, airy. "Less, but better" made visual.
  editorial: {
    id: "editorial",
    name: "Editorial Minimal",
    mood: "calm",
    bg: "#FBF8F3",
    bg2: "#F3EBE0",
    card: "#FFFFFF",
    cardSoft: "rgba(224,85,11,0.06)",
    border: "rgba(26,20,16,0.10)",
    text: "#1A1410",
    textBody: "#4A4038",
    textMuted: "#8A7E70",
    accent: "#D94E0A",
    accentSoft: "#E0712B",
    flame: "linear-gradient(135deg, #E0550B 0%, #F59A3C 100%)",
    onFlame: "#FFFFFF",
    heroImage: false,
    heroOverlay: "none",
    heroBg: "#FBF8F3",
    ctaGlow: false,
    slowZoom: false,
    bigNumber: false,
  },

  // v3 — Bold Kinetic: vivid sunset, high energy, big numbers. Sprint momentum.
  kinetic: {
    id: "kinetic",
    name: "Bold Kinetic",
    mood: "kinetic",
    bg: "#0A0710",
    bg2: "#130A14",
    card: "#1B1020",
    cardSoft: "rgba(255,61,129,0.08)",
    border: "rgba(255,255,255,0.08)",
    text: "#FFFFFF",
    textBody: "#D7CBD5",
    textMuted: "#8A7A90",
    accent: "#FF8A1F",
    accentSoft: "#FFC14D",
    flame: "linear-gradient(135deg, #FF3D81 0%, #FF6A1A 55%, #FFB347 100%)",
    onFlame: "#0C0C11",
    heroImage: true,
    heroOverlay: "linear-gradient(165deg, rgba(255,61,129,0.35) 0%, rgba(12,8,16,0.72) 55%, rgba(10,7,16,0.96) 100%)",
    heroBg: "#0A0710",
    ctaGlow: true,
    slowZoom: true,
    bigNumber: true,
  },
};

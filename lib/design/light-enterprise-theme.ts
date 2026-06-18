/**
 * Aipify Design Standard V1 — Light Enterprise Theme
 * Official visual tokens for APP, Platform, Growth Partner, and Business Packs.
 * Default theme: warm off-white canvas, Companion Purple, soft blue-purple accents.
 */

export const LIGHT_ENTERPRISE_THEME = {
  version: "1.0",
  name: "Light Enterprise Theme",
  principle:
    "Users spend entire workdays inside Aipify. Reduce visual fatigue. Choose clarity over effects.",
} as const;

/** CSS custom property names — mirror app/globals.css */
export const AipifyDesignTokens = {
  canvas: "--aipify-canvas",
  surface: "--aipify-surface",
  surfaceMuted: "--aipify-surface-muted",
  surfaceSubtle: "--aipify-surface-subtle",
  border: "--aipify-border",
  borderStrong: "--aipify-border-strong",
  textPrimary: "--aipify-text-primary",
  textSecondary: "--aipify-text-secondary",
  textMuted: "--aipify-text-muted",
  companionPurple: "--aipify-companion-purple",
  companionPurpleHover: "--aipify-companion-purple-hover",
  accent: "--aipify-accent",
  accentSoft: "--aipify-accent-soft",
  accentMuted: "--aipify-accent-muted",
  focusRing: "--aipify-focus-ring",
} as const;

/** Raw hex values for charts, PDF exports, and non-CSS contexts */
export const AipifyDesignColors = {
  canvas: "#F7F6F3",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F2EF",
  surfaceSubtle: "#FAFAF8",
  border: "#E7E5E4",
  borderStrong: "#D6D3D1",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  companionPurple: "#7C3AED",
  companionPurpleHover: "#6D28D9",
  accent: "#6366F1",
  accentSoft: "#EEF2FF",
  accentMuted: "#E0E7FF",
  focusRing: "#DDD6FE",
} as const;

/** Tailwind utility classes aligned to Design Standard V1 */
export const AipifyShellClasses = {
  canvas: "bg-aipify-canvas text-aipify-text",
  surface: "bg-aipify-surface border border-aipify-border",
  surfaceCard: "rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm",
  surfaceMuted: "bg-aipify-surface-muted",
  topbar: "border-b border-aipify-border bg-aipify-surface/95 backdrop-blur-sm",
  sidebar: "border-r border-aipify-border bg-aipify-surface",
  input:
    "rounded-xl border border-aipify-border bg-aipify-surface-muted text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-accent focus:bg-aipify-surface focus:outline-none focus:ring-2 focus:ring-aipify-focus",
  primaryButton:
    "rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white transition hover:bg-aipify-companion-hover focus:outline-none focus:ring-2 focus:ring-aipify-focus disabled:opacity-50",
  secondaryButton:
    "rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted",
  link: "text-aipify-accent hover:text-aipify-companion",
} as const;

export const AipifyNavClasses = {
  item: "text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text",
  itemIcon: "text-aipify-text-muted",
  itemActive: "bg-aipify-companion text-white shadow-sm",
  itemActiveIcon: "text-white",
  groupLabel: "text-aipify-text-muted hover:bg-aipify-surface-muted hover:text-aipify-text-secondary",
} as const;

/** Surfaces that must NOT use pure #FFFFFF as page background */
export const FORBIDDEN_PAGE_BACKGROUNDS = ["#FFFFFF", "#FFF", "white"] as const;

export const DESIGN_STANDARD_AVOID = [
  "black-first dashboards",
  "gaming interfaces",
  "neon color schemes",
  "cyberpunk themes",
  "hacker aesthetics",
  "visual clutter",
  "excessive gradients",
  "overuse of animations",
  "discord-style interfaces",
  "developer-centric design",
] as const;

export const DESIGN_STANDARD_WANT = [
  "Companion Purple",
  "Soft Blue-Purple accents",
  "Warm Off-White canvas",
  "Professional gray surfaces",
  "Enterprise appearance",
  "Premium SaaS feel",
  "Modern typography",
  "Calm user experience",
  "Executive readiness",
  "Long session comfort",
] as const;

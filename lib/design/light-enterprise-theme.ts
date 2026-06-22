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
  ghostButton:
    "rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-aipify-text-secondary transition hover:bg-aipify-surface-muted focus:outline-none focus:ring-2 focus:ring-aipify-focus",
  primaryButton:
    "rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white transition hover:bg-aipify-companion-hover focus:outline-none focus:ring-2 focus:ring-aipify-focus disabled:opacity-50",
  secondaryButton:
    "rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted",
  link: "text-aipify-accent hover:text-aipify-companion",
  dangerButton:
    "rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100",
  pageTitle: "text-2xl font-semibold tracking-tight text-aipify-text sm:text-3xl",
  pageSubtitle: "mt-2 text-sm leading-relaxed text-aipify-text-secondary sm:text-base",
  metricWidget: "rounded-2xl border border-aipify-border bg-aipify-surface p-4 shadow-sm",
  widgetGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;

/** Public marketing site — Light Enterprise, not dark-first */
export const AipifyMarketingClasses = {
  canvas: "bg-aipify-canvas text-aipify-text",
  header: "sticky top-0 z-50 border-b border-aipify-border bg-aipify-surface/95 backdrop-blur-sm",
  navLink: "text-sm font-medium text-aipify-text-secondary transition hover:text-aipify-companion",
  navLinkActive: "text-sm font-medium text-aipify-companion",
  footer: "border-t border-aipify-border bg-aipify-surface-muted",
  heroGradient:
    "pointer-events-none absolute inset-0 bg-gradient-to-br from-aipify-accent-soft/80 via-transparent to-violet-50/60",
  primaryCta:
    "inline-flex items-center justify-center rounded-xl bg-aipify-companion px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aipify-companion-hover focus:outline-none focus:ring-2 focus:ring-aipify-focus",
  secondaryCta:
    "inline-flex items-center justify-center rounded-xl border border-aipify-border bg-aipify-surface px-6 py-3 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted",
  sectionAlt: "border-y border-aipify-border bg-aipify-surface-muted/60",
  card: "rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm",
} as const;

export const AipifyNavClasses = {
  item: "text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text",
  itemIcon: "text-aipify-text-secondary",
  itemActive: "bg-aipify-companion text-white shadow-sm",
  itemActiveIcon: "text-white",
  groupLabel: "text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text",
} as const;

/**
 * APP sidebar typography — shared accessibility scale for all customer workspaces.
 * Use these tokens instead of ad-hoc text-xs/text-sm on navigation surfaces.
 */
export const AipifySidebarTypography = {
  workspaceTitle: "text-xl font-bold leading-tight text-aipify-text",
  workspaceDescription: "text-base font-medium leading-[1.4] text-aipify-text-secondary line-clamp-2",
  searchMenuRow: "text-base font-medium leading-snug text-aipify-text",
  searchMenuGroup: "text-[15px] font-medium leading-snug text-aipify-text-secondary",
  searchMenuDescription: "text-base leading-[1.4] text-aipify-text-secondary",
  sectionLabel:
    "text-[15px] font-bold uppercase tracking-[0.06em] text-aipify-text-secondary",
  sectionLabelButton:
    "text-[15px] font-bold uppercase tracking-[0.06em] text-aipify-text-secondary transition hover:bg-aipify-surface-muted hover:text-aipify-text",
  navigationItem:
    "text-base font-semibold leading-[1.4] text-aipify-text-secondary",
  navigationItemActive: "text-[17px] font-semibold leading-[1.4] text-white",
  subNavigationItem: "text-base font-medium leading-[1.4] text-aipify-text-secondary",
  accessHint: "text-[15px] font-normal leading-[1.4] text-amber-800",
  workspaceSummary: "text-base leading-[1.5] text-aipify-text-secondary",
  workspaceSummaryLabel: "font-semibold text-aipify-text-secondary",
  workspaceSummaryValue: "font-medium text-aipify-text",
  workspaceSummaryFooter: "text-base font-semibold leading-[1.45] text-aipify-text",
  workspaceSummaryCopyright: "text-sm leading-[1.45] text-aipify-text-secondary",
  feedbackButton: "text-[17px] font-semibold leading-none",
  keyboardHint: "text-sm font-semibold uppercase tracking-wide text-aipify-text-secondary",
  searchInput: "text-base text-aipify-text placeholder:text-aipify-text-secondary",
  mobileNavItem: "text-sm font-semibold leading-tight sm:text-base",
  navItemRow:
    "flex w-full min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2",
  navIcon: "size-[21px] shrink-0",
  chevron: "size-5 shrink-0 text-aipify-text-secondary",
  compactToggle: "rounded-lg p-2 text-aipify-text-secondary transition hover:bg-aipify-surface-muted hover:text-aipify-text focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus",
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

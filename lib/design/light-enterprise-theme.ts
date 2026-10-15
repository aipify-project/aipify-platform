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
  /** Shared APP sidebar desktop width — keep feedback/privacy offsets in sync (V2: 256 within 240–260). */
  sidebarDesktopWidth: "w-[256px]",
  input:
    "rounded-xl border border-aipify-border bg-aipify-surface-muted text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-accent focus:bg-aipify-surface focus:outline-none focus:ring-2 focus:ring-aipify-focus",
  ghostButton:
    "rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-aipify-text-secondary transition hover:bg-aipify-surface-muted focus:outline-none focus:ring-2 focus:ring-aipify-focus",
  primaryButton:
    "rounded-xl bg-[image:var(--app-primary-gradient,linear-gradient(135deg,#7357e8,#5577f2))] px-5 py-2.5 text-[0.9375rem] font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-aipify-focus disabled:opacity-50",
  secondaryButton:
    "rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted",
  link: "text-aipify-accent hover:text-aipify-companion",
  dangerButton:
    "rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100",
  pageTitle: "text-[1.75rem] font-semibold leading-tight tracking-tight text-aipify-text sm:text-[1.875rem]",
  pageSubtitle: "mt-2 text-base leading-relaxed text-aipify-text-secondary sm:text-[1.0625rem]",
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
  /** Platform selected state — light blue (selection), not status green/red. */
  itemActiveLight: "bg-sky-100 text-sky-950 shadow-sm ring-1 ring-sky-200/90",
  itemActiveLightIcon: "text-sky-700",
  groupLabel: "text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text",
} as const;

/**
 * APP sidebar typography — shared accessibility scale for all customer workspaces.
 * Use these tokens instead of ad-hoc text-xs/text-sm on navigation surfaces.
 */
export const AipifySidebarTypography = {
  workspaceTitle: "text-base font-bold leading-snug text-aipify-text line-clamp-2",
  workspaceDescription:
    "text-[13px] font-medium leading-snug text-aipify-text-secondary line-clamp-2",
  searchMenuRow: "text-[13px] font-medium leading-snug text-aipify-text",
  searchMenuGroup: "text-[12px] font-medium leading-snug text-aipify-text-secondary",
  searchMenuDescription: "text-[13px] leading-snug text-aipify-text-secondary",
  sectionLabel:
    "text-[12px] font-semibold uppercase tracking-[0.06em] text-aipify-text/80",
  sectionLabelButton:
    "text-[12px] font-semibold uppercase tracking-[0.06em] text-aipify-text/80 transition hover:bg-aipify-surface-muted hover:text-aipify-text",
  navigationItem:
    "text-[15px] font-medium leading-snug text-aipify-text-secondary",
  navigationItemActive: "text-[15px] font-semibold leading-snug text-white",
  subNavigationItem: "text-[15px] font-medium leading-snug text-aipify-text-secondary",
  accessHint: "text-[13px] font-normal leading-snug text-amber-800",
  workspaceSummary: "text-[13px] leading-[1.4] text-aipify-text-muted sm:text-[14px]",
  workspaceSummaryLabel:
    "block text-[11px] font-semibold uppercase tracking-[0.06em] leading-snug text-aipify-text-muted sm:text-[12px]",
  workspaceSummaryValue:
    "mt-0.5 block min-w-0 text-[13px] font-semibold leading-snug text-aipify-text sm:text-[14px]",
  workspaceSummaryRow: "space-y-0.5",
  workspaceSummaryRowTight: "space-y-0.5",
  workspaceSummaryFooter:
    "text-[13px] font-semibold leading-[1.4] text-aipify-text-secondary sm:text-[14px]",
  workspaceSummaryCopyright:
    "text-[12px] leading-[1.4] text-aipify-text-muted sm:text-[13px]",
  feedbackButton: "text-[14px] font-medium leading-none",
  keyboardHint: "text-[12px] font-semibold uppercase tracking-wide text-aipify-text-secondary",
  searchInput: "text-[14px] text-aipify-text placeholder:text-aipify-text-secondary",
  mobileNavItem: "text-[14px] font-semibold leading-snug",
  mobileNavLabel: "min-w-0 max-w-[5.25rem] break-words text-center text-[12px] leading-snug line-clamp-2",
  navLabelWrap: "block break-words leading-snug line-clamp-2",
  navItemRow:
    "flex w-full min-h-12 items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2",
  navIcon: "size-[22px] shrink-0",
  chevron: "size-5 shrink-0 text-aipify-text/70",
  compactToggle: "rounded-lg p-2 text-aipify-text-secondary transition hover:bg-aipify-surface-muted hover:text-aipify-text focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus",
} as const;

/** APP sidebar layout tokens — desktop shell + feedback positioning */
export const AipifySidebarLayout = {
  desktopWidthPx: 256,
  navScrollRegion: "min-h-0 flex-1 overflow-y-auto overscroll-contain",
  /** Footer hosts license card + privacy control — safe-area only (no floating offset). */
  footerRegion: "shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pb-3",
  brandRegion: "shrink-0",
  asideDesktop:
    "hidden h-screen shrink-0 flex-col overflow-hidden lg:flex",
  feedbackDesktopPosition: "lg:left-[calc(256px+1rem)] lg:bottom-6",
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

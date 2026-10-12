/**
 * Job 63 — Customer APP premium visual system (scoped; does not redefine Platform/public tokens).
 */

export const APP_VISUAL_SYSTEM_VERSION = "63.1";

/** Final documented palette (brief start values; contrast-tuned muted text). */
export const AppVisualColors = {
  canvas: "#F3F5F9",
  surface: "#F8F9FD",
  surfaceAlt: "#F5F7FB",
  card: "#FFFFFF",
  softSurface: "#F1F3F8",
  primary: "#7357E8",
  primaryBlue: "#5577F2",
  primarySoft: "#EEEAFE",
  border: "#E5E7F0",
  borderAccent: "#CFC4FF",
  text: "#202336",
  /** Slightly darker than brief #6F7487 for WCAG body contrast on light surfaces. */
  textMuted: "#5C6275",
  positive: "#22A06B",
  pending: "#E78A18",
  negative: "#D64545",
  neutral: "#7B8194",
  primaryGradient: "linear-gradient(135deg, #7357E8 0%, #5577F2 100%)",
} as const;

export const AppVisualClasses = {
  /** Outer viewport canvas (layer 1). */
  shellRoot: "aipify-app-shell relative min-h-screen overflow-x-hidden bg-[var(--app-canvas)] text-[var(--app-text)]",
  /** SaaS window over canvas (layer 2). */
  appFrame:
    "relative z-[1] flex min-h-screen w-full flex-col lg:flex-row lg:rounded-none lg:shadow-[var(--app-shadow-frame)]",
  sidebar:
    "border-r border-[var(--app-border)] bg-[var(--app-card)]/95 backdrop-blur-[2px]",
  mainColumn: "relative z-[1] flex min-w-0 flex-1 flex-col bg-[var(--app-surface)]",
  mainScroll:
    "relative z-[1] flex-1 overflow-y-auto scroll-pb-[calc(6rem+env(safe-area-inset-bottom))] px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:scroll-pb-8 lg:px-8 lg:pb-8",
  card:
    "rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] sm:p-6",
  cardInteractive:
    "rounded-[var(--app-radius-lg)] border border-[var(--app-border)] bg-[var(--app-card)] p-5 shadow-[var(--app-shadow-card)] transition hover:border-[var(--app-border-accent)] hover:shadow-[var(--app-shadow-card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] sm:p-6",
  navItem:
    "rounded-xl text-[var(--app-text-muted)] hover:bg-[var(--app-soft-surface)] hover:text-[var(--app-text)]",
  navItemActive:
    "rounded-xl bg-[image:var(--app-primary-soft-fill)] text-[var(--app-primary)] shadow-sm ring-1 ring-[var(--app-border-accent)]",
  navItemActiveIcon: "text-[var(--app-primary)]",
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-surface)]",
} as const;

/**
 * Canonical Customer APP content width + Kompis workspace layout tokens.
 * Task: AIPIFY.APP.GLOBAL.KOMPIS.WORKSPACE.AND.CANONICAL.PANEL.WIDTH.V1
 *
 * One system for page width, padding, split grid, Kompis column, and drawers.
 * Prefer these classes over page-local max-w-* magic numbers.
 */

/** Canonical desktop content max-width (enterprise panels, not full-bleed). */
export const APP_CONTENT_MAX_WIDTH_PX = 1560;

/** Kompis side column share on desktop split (~25–30%). */
export const APP_KOMPIS_SPLIT_FRACTION = "28%";

/** Overlay / tablet drawer max width. */
export const APP_KOMPIS_DRAWER_MAX_WIDTH_CLASS = "max-w-md";

export type AppKompisLayoutMode = "split" | "overlay" | "full";

/**
 * Shared Tailwind class tokens. Keep string literals complete so Tailwind JIT sees them.
 */
export const AppLayoutClasses = {
  /** Standard APP page content wrapper — desktop-first enterprise width. */
  page: "mx-auto w-full max-w-[1560px] px-4 pb-10 pt-6 sm:px-6 lg:px-8",
  /**
   * Width-only wrapper for content already inside DashboardShell main padding.
   * Prefer this for panels nested under the APP shell.
   */
  pageWidth: "mx-auto w-full max-w-[1560px]",
  /** Horizontal padding only (when vertical spacing is owned by the shell). */
  pagePaddingX: "px-4 sm:px-6 lg:px-8",
  /** Main/Kompis split when Kompis is open on large desktop. */
  splitGrid:
    "w-full lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,28%)] lg:items-start lg:gap-6 xl:gap-8",
  splitMain: "min-w-0 w-full",
  splitKompis:
    "min-w-0 w-full lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-hidden",
  /** Overlay drawer (tablet / data-heavy pages) — does not shrink main content. */
  overlayBackdrop: "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px]",
  overlayPanel:
    "fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:border-l sm:border-t-0",
  /** Full workspace (dedicated Kompis page). */
  fullWorkspace: "mx-auto flex w-full max-w-[1560px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8",
  /** Docked Kompis column surface (not fixed). */
  dockedPanel:
    "flex h-full max-h-[min(92vh,52rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950 lg:max-h-[calc(100vh-6rem)]",
} as const;

export const APP_LAYOUT_BREAKPOINTS = {
  /** Below this, prefer overlay/full over permanent split. */
  splitMinPx: 1024,
  tabletMaxPx: 1023,
  mobileMaxPx: 639,
} as const;

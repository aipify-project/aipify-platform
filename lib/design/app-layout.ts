/**
 * Canonical Customer APP content width tokens.
 * Billing is the first reference page — prefer these over page-local max-w-* values.
 */

export const APP_CONTENT_MAX_WIDTH_PX = 1560;

export const AppLayoutClasses = {
  /** Full page wrapper with padding (standalone pages). */
  page: "mx-auto w-full max-w-[1560px] px-4 pb-10 pt-6 sm:px-6 lg:px-8",
  /** Width only — use inside DashboardShell main which already pads horizontally. */
  pageWidth: "mx-auto w-full max-w-[1560px]",
  pagePaddingX: "px-4 sm:px-6 lg:px-8",
  sectionGap: "space-y-6 lg:space-y-8",
  contentGrid: "grid grid-cols-1 gap-6 xl:grid-cols-12 xl:gap-8",
  mainColumn: "min-w-0 xl:col-span-8",
  sideColumn: "min-w-0 xl:col-span-4",
  metricGrid: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
  card: "rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm sm:p-6",
  cardMuted: "rounded-2xl border border-aipify-border bg-aipify-canvas/60 p-5 sm:p-6",
} as const;

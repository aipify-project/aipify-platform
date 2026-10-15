/**
 * Canonical Platform Admin content layout.
 * Fasit: `/platform/customers` — full content width inside DashboardShell (no narrow max-w-* page rails).
 * Prefer these tokens over page-local `mx-auto max-w-3xl|4xl|5xl|6xl` wrappers.
 */

/** Reference: customer registry uses the full main column (shell already pads horizontally). */
export const PLATFORM_CONTENT_MAX_WIDTH_PX = null;

export const PlatformLayoutClasses = {
  /**
   * Full-width page body inside Platform DashboardShell.
   * Do not add horizontal padding here — shell main already provides px-4/sm:px-6/lg:px-8.
   */
  page: "w-full space-y-6 lg:space-y-8",
  /** Same as page, with tighter section rhythm for dense tables. */
  pageTight: "w-full space-y-5 lg:space-y-6",
  /** Width-only utility when a panel already owns vertical spacing. */
  pageWidth: "w-full",
  sectionGap: "space-y-6 lg:space-y-8",
  /** Page title block. */
  pageHeader: "min-w-0",
  pageTitle: "text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50",
  pageSubtitle: "mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[15px]",
  /** White enterprise card — soft border + shadow (APP-aligned, Platform-safe). */
  card: "rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(32,35,54,0.04),0_8px_24px_rgba(32,35,54,0.05)] sm:p-6 dark:border-slate-700 dark:bg-slate-950/40",
  cardMuted:
    "rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/40",
  /** Metric / nav card grids — several cards per row when space allows. */
  metricGrid: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  metricGridDense: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
  navCardGrid: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
  /** Active platform tab / chip — light blue selection (not Companion purple fill). */
  tabActive: "bg-sky-100 text-sky-950 ring-1 ring-sky-200/90",
  tabIdle: "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
} as const;

/** Status color roles for Platform Admin surfaces (icon + text; never color alone). */
export const PlatformStatusToneClasses = {
  positive: "text-emerald-700 dark:text-emerald-400",
  negative: "text-rose-700 dark:text-rose-400",
  warning: "text-amber-700 dark:text-amber-400",
  neutral: "text-slate-600 dark:text-slate-400",
} as const;

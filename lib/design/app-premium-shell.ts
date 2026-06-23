import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

/** Shared APP premium surface tokens — Design Pilot 01 / Light Enterprise */
export const AppPremiumShell = {
  page: "mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-8",
  /** Command Brief overview — full APP workspace width, sidebar-aligned padding only */
  commandBriefPage: "w-full px-6 pb-8 pt-5 sm:px-8",
  commandBriefGrid: "grid grid-cols-12 gap-3 lg:gap-4 xl:gap-5",
  commandBriefSectionTitle: "text-base font-semibold tracking-tight text-aipify-text sm:text-[1.0625rem]",
  commandBriefBody: "text-base leading-relaxed text-aipify-text-secondary sm:text-lg sm:leading-7",
  commandBriefMeta: "text-[13px] leading-snug text-aipify-text-muted",
  commandBriefListTitle: "text-[13px] font-semibold leading-snug text-aipify-text",
  commandBriefListBody: "text-[13px] leading-snug text-aipify-text-secondary",
  commandBriefMetricLabel: "text-[13px] font-medium leading-snug text-aipify-text-secondary",
  commandBriefMetricValue: "text-[1.6875rem] font-bold leading-none tracking-tight text-aipify-text sm:text-[1.875rem]",
  commandBriefMetricDescription:
    "mt-auto pt-2 text-[12px] leading-snug text-aipify-text-secondary",
  canvas: "min-h-full bg-aipify-canvas",
  elevatedCard:
    "rounded-2xl border border-aipify-border bg-aipify-surface shadow-sm transition-shadow",
  elevatedCardHover: "hover:border-aipify-border-strong hover:shadow-md",
  sectionGap: "space-y-8",
  eyebrow:
    "text-xs font-semibold uppercase tracking-[0.14em] text-aipify-companion",
  pageTitle: AipifyShellClasses.pageTitle,
  pageDescription: AipifyShellClasses.pageSubtitle,
  sectionTitle: "text-lg font-semibold tracking-tight text-aipify-text sm:text-xl",
  sectionSubtitle: "mt-1 text-sm leading-relaxed text-aipify-text-secondary",
  metricValue: "text-[1.6875rem] font-bold leading-none tracking-tight text-aipify-text sm:text-[1.875rem]",
  metricLabel: "text-[13px] font-medium leading-snug text-aipify-text-secondary",
  metricDescription: "mt-1.5 text-[12px] leading-snug text-aipify-text-secondary",
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2 focus-visible:ring-offset-aipify-canvas",
} as const;

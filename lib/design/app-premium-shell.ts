import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

/** Shared APP premium surface tokens — Design Pilot 01 / Light Enterprise */
export const AppPremiumShell = {
  page: "mx-auto w-full max-w-[1440px] px-4 pb-10 pt-6 sm:px-6 lg:px-8",
  /** Command Brief overview — full APP workspace width, sidebar-aligned padding only */
  commandBriefPage: "w-full px-6 pb-10 pt-6 sm:px-8",
  commandBriefGrid: "grid grid-cols-12 gap-4 lg:gap-6 xl:gap-8",
  commandBriefSectionTitle: "text-xl font-semibold tracking-tight text-aipify-text sm:text-[1.35rem]",
  commandBriefBody: "text-base leading-relaxed text-aipify-text-secondary sm:text-[17px] sm:leading-7",
  commandBriefMeta: "text-sm leading-snug text-aipify-text-secondary",
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
  metricValue: "text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl",
  metricLabel: "text-sm font-medium text-aipify-text-secondary",
  metricDescription: "mt-2 text-sm leading-relaxed text-aipify-text-muted",
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2 focus-visible:ring-offset-aipify-canvas",
} as const;

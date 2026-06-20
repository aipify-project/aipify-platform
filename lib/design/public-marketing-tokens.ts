/**
 * Canonical design tokens for public marketing subpages.
 * Values mirror the locked homepage Light Enterprise system.
 */
import { AipifyMarketingClasses, AipifyShellClasses } from "./light-enterprise-theme";

export const PublicMarketingTokens = {
  layout: {
    maxWidth: "90rem",
    readingWidth: "48rem",
    wideWidth: "80rem",
    formWidth: "42rem",
    legalWidth: "42rem",
  },
} as const;

export const PublicMarketingClasses = {
  canvas: AipifyMarketingClasses.canvas,
  section: "py-16 sm:py-20 lg:py-24",
  sectionAlt: AipifyMarketingClasses.sectionAlt,
  container: "mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8",
  containerWide: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  reading: "max-w-3xl",
  sectionHeading: "text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl",
  pageTitle: "text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
  sectionTitle: "text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl",
  sectionSubtitle: "mt-4 text-lg leading-relaxed text-aipify-text-secondary",
  cardTitle: "text-lg font-semibold text-aipify-text",
  cardBody: "mt-2 text-base leading-relaxed text-aipify-text-secondary",
  cardLabel: "text-xs font-semibold uppercase tracking-wide text-aipify-text-secondary",
  card: AipifyMarketingClasses.card,
  cardInteractive:
    "rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm transition hover:border-aipify-companion/30 hover:shadow-md focus-within:ring-2 focus-within:ring-aipify-focus",
  eyebrow:
    "inline-flex items-center rounded-full border border-aipify-accent-muted bg-aipify-accent-soft px-4 py-1.5 text-sm font-medium text-aipify-companion",
  primaryCta: AipifyMarketingClasses.primaryCta,
  secondaryCta: AipifyMarketingClasses.secondaryCta,
  link: AipifyShellClasses.link,
  input: AipifyShellClasses.input,
  beforePanel: "rounded-2xl border border-red-200 bg-red-50 p-6",
  beforeTitle: "text-lg font-semibold text-red-900",
  afterPanel: "rounded-2xl border border-emerald-200 bg-emerald-50 p-6",
  afterTitle: "text-lg font-semibold text-emerald-900",
  scenarioBadge: "text-xs font-semibold uppercase tracking-wide text-aipify-companion",
  comingSoon: "rounded-xl border border-dashed border-aipify-border bg-aipify-surface-muted p-5 text-center",
} as const;

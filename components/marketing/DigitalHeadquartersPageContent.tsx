import Link from "next/link";
import { MarketingCtaBand, MarketingPageHeader } from "@/components/marketing";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import type { MarketingCtaBandLabels } from "./MarketingCtaBand";

type Section = { title: string; body: string };

type DigitalHeadquartersPageContentProps = {
  title: string;
  subtitle: string;
  intro?: string;
  sections?: Section[];
  futureItems?: string[];
  emptyMessage?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  ctaHref?: string;
  ctaSecondaryHref?: string;
  ctaBand: MarketingCtaBandLabels;
  variant?: "full" | "scaffold";
  breadcrumbs?: Parameters<typeof MarketingPageHeader>[0]["breadcrumbs"];
};

export default function DigitalHeadquartersPageContent({
  title,
  subtitle,
  intro,
  sections = [],
  futureItems = [],
  emptyMessage,
  ctaPrimary,
  ctaSecondary,
  ctaHref = "/contact",
  ctaSecondaryHref = "/book-demo",
  ctaBand,
  variant = "full",
  breadcrumbs,
}: DigitalHeadquartersPageContentProps) {
  return (
    <>
      <MarketingPageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {intro ? <p className="text-base leading-relaxed text-aipify-text-secondary">{intro}</p> : null}

        {sections.length > 0 ? (
          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-aipify-text">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{section.body}</p>
              </section>
            ))}
          </div>
        ) : null}

        {variant === "scaffold" && emptyMessage ? (
          <p className="mt-8 rounded-xl border border-aipify-border bg-aipify-surface-muted/60 p-5 text-sm text-aipify-text-secondary">
            {emptyMessage}
          </p>
        ) : null}

        {futureItems.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {futureItems.map((item) => (
              <li key={item} className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-xs font-medium text-aipify-text-muted">
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {ctaPrimary ? (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={ctaHref} className={`${AipifyMarketingClasses.primaryCta} px-6 py-3 text-center`}>
              {ctaPrimary}
            </Link>
            {ctaSecondary ? (
              <Link href={ctaSecondaryHref} className={`${AipifyMarketingClasses.secondaryCta} px-6 py-3 text-center`}>
                {ctaSecondary}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}

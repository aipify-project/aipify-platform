import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import PublicBreadcrumbs, { type PublicBreadcrumbItem } from "./PublicBreadcrumbs";

export type PublicPageHeroCta = {
  label: string;
  href: string;
  analyticsId?: string;
};

type PublicPageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  subtitleLines?: string[];
  benefits?: string[];
  breadcrumbs?: PublicBreadcrumbItem[];
  primaryCta?: PublicPageHeroCta;
  secondaryCta?: PublicPageHeroCta;
  compact?: boolean;
  align?: "left" | "center";
};

export default function PublicPageHero({
  eyebrow,
  title,
  subtitle,
  subtitleLines,
  benefits,
  breadcrumbs,
  primaryCta,
  secondaryCta,
  compact = false,
  align = "left",
}: PublicPageHeroProps) {
  const isCenter = align === "center";
  const py = compact ? "py-10 lg:py-14" : "py-12 lg:py-20";

  return (
    <section className="relative overflow-hidden border-b border-aipify-border">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[280px] w-[280px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute top-16 -left-16 h-[220px] w-[220px] rounded-full bg-indigo-50/80 blur-3xl" />
      </div>

      <div className={`relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 ${py}`}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <PublicBreadcrumbs items={breadcrumbs} />
        ) : null}

        <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-aipify-accent-muted bg-aipify-accent-soft px-4 py-1.5 text-sm font-medium text-aipify-companion">
              {eyebrow}
            </span>
          ) : null}

          <h1
            className={`${eyebrow ? "mt-5" : ""} text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]`}
          >
            {title}
          </h1>

          {subtitleLines && subtitleLines.length > 0 ? (
            <ul
              className={`mt-5 space-y-1.5 text-lg leading-relaxed text-aipify-text-secondary ${isCenter ? "mx-auto max-w-2xl" : ""}`}
            >
              {subtitleLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : subtitle ? (
            <p className="mt-5 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p>
          ) : null}

          {benefits && benefits.length > 0 ? (
            <ul className={`mt-6 space-y-2.5 ${isCenter ? "mx-auto max-w-xl text-left" : ""}`}>
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-base text-aipify-text">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion"
                    aria-hidden="true"
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {(primaryCta || secondaryCta) && (
            <div
              className={`mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${isCenter ? "justify-center" : ""}`}
            >
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className={`${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
                  {...marketingDataAttr("cta_click", primaryCta.analyticsId ?? "hero_primary")}
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className={`${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
                  {...marketingDataAttr("cta_click", secondaryCta.analyticsId ?? "hero_secondary")}
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

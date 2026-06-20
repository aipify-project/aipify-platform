import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import CommandBriefMockup from "@/components/marketing/homepage/CommandBriefMockup";
import { PublicCTA, PublicPageHero } from "@/components/marketing/public";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepageRedesignContent } from "@/lib/marketing/parse-homepage";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type CompanionPageLabels = {
  meta: { title: string; description: string };
  breadcrumbs: { home: string; companion: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  cta: {
    title: string;
    subtitle: string;
    bookDemo: string;
    explorePlatform: string;
  };
};

type Props = {
  labels: CompanionPageLabels;
  companion: HomepageRedesignContent["companion"];
  commandBrief: HomepageRedesignContent["commandBrief"];
  appName: string;
};

export default function CompanionPageContent({ labels, companion, commandBrief, appName }: Props) {
  const { hero, breadcrumbs, cta } = labels;

  return (
    <>
      <PublicPageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.companion },
        ]}
        primaryCta={{
          label: hero.ctaPrimary,
          href: MARKETING_PRIMARY_CTA_HREFS.bookDemo,
          analyticsId: "companion_hero_book_demo",
        }}
        secondaryCta={{
          label: hero.ctaSecondary,
          href: "/product",
          analyticsId: "companion_hero_platform",
        }}
      />

      <section className={AipifyMarketingClasses.sectionAlt} aria-labelledby="companion-capabilities">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <div className="flex items-center gap-3">
                <AipifyPulse size={40} variant="gradient" title={appName} aria-label={appName} />
                <span className="text-sm font-semibold text-aipify-companion">Aipify Companion</span>
              </div>
              <h2
                id="companion-capabilities"
                className="mt-5 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl"
              >
                {companion.title}
              </h2>
              {companion.subtitle ? (
                <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{companion.subtitle}</p>
              ) : null}
              <Link
                href="/product"
                className="mt-6 inline-block text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
                {...marketingDataAttr("cta_click", "companion_platform_link")}
              >
                {companion.learnMore} →
              </Link>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {companion.capabilities.map((cap) => (
                <li
                  key={cap.title}
                  className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3.5"
                >
                  <p className="font-semibold text-aipify-text">{cap.title}</p>
                  {cap.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{cap.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="command-brief-title">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 id="command-brief-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
                {commandBrief.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{commandBrief.subtitle}</p>
            </div>
            <CommandBriefMockup labels={commandBrief} compact />
          </div>
        </div>
      </section>

      <PublicCTA
        title={cta.title}
        subtitle={cta.subtitle}
        primaryLabel={cta.bookDemo}
        primaryHref={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
        secondaryLabel={cta.explorePlatform}
        secondaryHref="/product"
        analyticsPrimary="companion_cta_book_demo"
        analyticsSecondary="companion_cta_platform"
      />
    </>
  );
}

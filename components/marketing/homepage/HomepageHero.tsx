import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepageRedesignContent } from "@/lib/marketing/parse-homepage";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import CommandBriefMockup from "./CommandBriefMockup";

type HomepageHeroProps = {
  hero: HomepageRedesignContent["hero"];
  commandBrief: HomepageRedesignContent["commandBrief"];
};

export default function HomepageHero({ hero, commandBrief }: HomepageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[320px] w-[320px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[260px] w-[260px] rounded-full bg-indigo-50/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="inline-flex items-center rounded-full border border-aipify-accent-muted bg-aipify-accent-soft px-4 py-1.5 text-sm font-medium text-aipify-companion">
              {hero.badge}
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              {hero.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-aipify-text-secondary">{hero.subtitle}</p>

            {hero.benefits.length > 0 ? (
              <ul className="mt-6 space-y-2.5">
                {hero.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-base text-aipify-text">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
                className={`${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
                {...marketingDataAttr("cta_click", "hero_book_demo")}
              >
                {hero.ctaPrimary}
              </Link>
              <Link
                href="#how-it-works"
                className={`${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
                {...marketingDataAttr("cta_click", "hero_see_how_it_works")}
              >
                {hero.ctaSecondary}
              </Link>
            </div>

            <Link
              href="/pricing#business-packs"
              className="mt-4 inline-block text-sm font-medium text-aipify-accent hover:text-aipify-companion"
              {...marketingDataAttr("cta_click", "hero_explore_packs")}
            >
              {hero.explorePacks} →
            </Link>
          </div>

          <div className="lg:pl-4">
            <CommandBriefMockup labels={commandBrief} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

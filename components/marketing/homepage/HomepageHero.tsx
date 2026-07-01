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
    <section className="relative border-b border-aipify-border bg-aipify-surface">
      <div className="mx-auto max-w-[87.5rem] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-aipify-companion">{hero.badge}</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-aipify-text sm:text-[2.75rem] sm:leading-[1.1]">
              {hero.title}
            </h1>

            <p className="mt-4 text-xl font-semibold leading-snug text-aipify-text sm:text-2xl">{hero.headline}</p>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-aipify-text-secondary">{hero.description}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                {...marketingDataAttr("cta_click", "hero_see_aipify_in_action")}
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CommandBriefMockup labels={commandBrief} variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

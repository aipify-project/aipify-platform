import Link from "next/link";
import CommandBriefMockup from "@/components/marketing/homepage/CommandBriefMockup";
import PublicBreadcrumbs from "@/components/marketing/public/PublicBreadcrumbs";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type ProductHeroProps = {
  hero: ProductPageContent["hero"];
  breadcrumbs: ProductPageContent["breadcrumbs"];
  commandBrief: ProductPageContent["commandBriefHero"];
};

export default function ProductHero({ hero, breadcrumbs, commandBrief }: ProductHeroProps) {
  return (
    <section id="overview" className="relative scroll-mt-20 overflow-hidden">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[320px] w-[320px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[260px] w-[260px] rounded-full bg-indigo-50/80 blur-3xl" />
      </div>

      <div className={`relative ${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <PublicBreadcrumbs
          items={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.platform }]}
        />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className={PublicMarketingClasses.eyebrow}>{hero.eyebrow}</span>

            <h1 className={`mt-5 ${PublicMarketingClasses.pageTitle}`}>{hero.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-aipify-text-secondary">{hero.subtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
                className={`${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
                {...marketingDataAttr("cta_click", "product_hero_book_demo")}
              >
                {hero.ctaPrimary}
              </Link>
              <Link
                href="#workflow"
                className={`${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
                {...marketingDataAttr("cta_click", "product_hero_see_how")}
              >
                {hero.ctaSecondary}
              </Link>
            </div>

            <Link
              href="/pricing#business-packs"
              className="mt-4 inline-block text-sm font-medium text-aipify-accent hover:text-aipify-companion"
              {...marketingDataAttr("cta_click", "product_hero_explore_packs")}
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

import Link from "next/link";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductBusinessPacksSectionProps = ProductPageContent["businessPacks"];

export default function ProductBusinessPacksSection({
  title,
  subtitle,
  modelTitle,
  modelSteps,
  modelNote,
  packs,
  exploreAll,
}: ProductBusinessPacksSectionProps) {
  return (
    <section id="business-packs" className="scroll-mt-20 border-y border-aipify-border" aria-labelledby="product-packs-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="max-w-2xl">
          <h2 id="product-packs-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
          {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
        </div>

        <div className={`mt-8 ${PublicMarketingClasses.card}`}>
          <h3 className={PublicMarketingClasses.cardTitle}>{modelTitle}</h3>
          <ol className="mt-4 space-y-2">
            {modelSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-aipify-text">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aipify-accent-soft text-xs font-semibold text-aipify-companion">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {modelNote ? <p className="mt-4 text-sm text-aipify-text-secondary">{modelNote}</p> : null}
        </div>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {packs.map((pack) => (
            <li
              key={pack.id}
              className="flex flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm transition hover:border-aipify-companion/30 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-aipify-text">Aipify {pack.name}</h3>
              <p className="mt-1 text-sm font-medium text-aipify-text-secondary">{pack.audience}</p>
              <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{pack.challenge}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {pack.capabilities.map((cap) => (
                  <li key={cap} className="flex gap-2 text-sm text-aipify-text">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                    {cap}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg border border-aipify-accent-muted bg-aipify-accent-soft/40 px-3 py-2 text-xs font-medium text-aipify-companion">
                Command Brief: {pack.briefSignal}
              </p>
              <Link
                href={pack.href}
                className="mt-5 text-sm font-semibold text-aipify-companion hover:text-aipify-companion-hover"
                {...marketingDataAttr("cta_click", `product_pack_${pack.id}`)}
              >
                {pack.cta} →
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/pricing#business-packs"
          className="mt-10 inline-block text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
          {...marketingDataAttr("cta_click", "product_explore_all_packs")}
        >
          {exploreAll} →
        </Link>
      </div>
    </section>
  );
}

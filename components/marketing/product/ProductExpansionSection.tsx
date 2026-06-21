import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductExpansionSectionProps = ProductPageContent["expansion"];

export default function ProductExpansionSection({ title, stages }: ProductExpansionSectionProps) {
  return (
    <section aria-labelledby="product-expansion-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <h2 id="product-expansion-title" className={`text-center ${PublicMarketingClasses.sectionHeading}`}>
          {title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stages.map((stage, i) => (
            <div key={stage.name} className={PublicMarketingClasses.card}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-aipify-text">{stage.name}</h3>
              </div>
              <ul className="mt-5 space-y-2">
                {stage.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

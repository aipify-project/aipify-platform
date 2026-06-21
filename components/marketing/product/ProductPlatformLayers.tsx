import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductPlatformLayersProps = ProductPageContent["platform"];

export default function ProductPlatformLayers({ title, subtitle, layers }: ProductPlatformLayersProps) {
  return (
    <section id="platform" className="scroll-mt-20 border-y border-aipify-border" aria-labelledby="product-platform-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="product-platform-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
          {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <ol className="relative space-y-0">
            {layers.map((layer, i) => (
              <li key={layer.name} className="relative flex flex-col items-center">
                <div className="w-full rounded-2xl border border-aipify-border bg-aipify-surface px-6 py-5 shadow-sm">
                  <p className="text-base font-semibold text-aipify-text">{layer.name}</p>
                  <ul className="mt-3 space-y-1.5">
                    {layer.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {i < layers.length - 1 ? (
                  <div className="flex flex-col items-center py-2" aria-hidden="true">
                    <span className="h-4 w-px bg-aipify-border" />
                    <span className="text-aipify-text-muted">↓</span>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

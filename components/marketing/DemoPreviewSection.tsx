import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type DemoPreviewCard = { title: string; description: string };

type DemoPreviewSectionProps = {
  title: string;
  openDemoCta: string;
  cards: DemoPreviewCard[];
};

export default function DemoPreviewSection({ title, openDemoCta, cards }: DemoPreviewSectionProps) {
  return (
    <section aria-labelledby="demo-preview-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="demo-preview-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.title} className={`${AipifyMarketingClasses.card} flex flex-col`}>
              <div
                className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-aipify-border bg-aipify-surface-muted text-xs font-medium uppercase tracking-wide text-aipify-text-muted"
                aria-hidden="true"
              >
                Preview
              </div>
              <h3 className="mt-5 text-lg font-semibold text-aipify-text">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-aipify-text-secondary">{card.description}</p>
              <Link
                href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
                className={`mt-5 inline-flex w-fit ${AipifyMarketingClasses.secondaryCta} px-5 py-2.5 text-sm`}
                {...marketingDataAttr("cta_click", `demo_preview_${card.title.toLowerCase().replace(/\s+/g, "_")}`)}
              >
                {openDemoCta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

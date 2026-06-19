import MarketingPrimaryCtas from "./MarketingPrimaryCtas";
import type { MarketingPrimaryCtaLabels } from "@/lib/marketing/primary-ctas";

export type MarketingCtaBandLabels = {
  title: string;
  subtitle?: string;
} & MarketingPrimaryCtaLabels;

type MarketingCtaBandProps = MarketingCtaBandLabels;

export default function MarketingCtaBand({ title, subtitle, bookDemo, earlyAccess, growthPartners }: MarketingCtaBandProps) {
  return (
    <section className="border-t border-aipify-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-violet-600/10 px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-aipify-text sm:text-3xl">{title}</h2>
          {subtitle ? <p className="mx-auto mt-3 max-w-xl text-aipify-text-secondary">{subtitle}</p> : null}
          <div className="mt-8 flex justify-center">
            <MarketingPrimaryCtas
              labels={{ bookDemo, earlyAccess, growthPartners }}
              analyticsPrefix="cta_band"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

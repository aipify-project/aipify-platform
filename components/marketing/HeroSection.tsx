import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import PlatformPreviewStrip from "./PlatformPreviewStrip";

type PreviewItem = { label: string; description: string };

type HeroLabels = {
  badge: string;
  title: string;
  subtitle: string;
  notChatbot: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statInstall: string;
  statInstallLabel: string;
  statModules: string;
  statModulesLabel: string;
  statControl: string;
  statControlLabel: string;
};

type HeroSectionProps = {
  labels: HeroLabels;
  previewItems?: PreviewItem[];
  outcomes?: string[];
};

export default function HeroSection({ labels, previewItems, outcomes }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[360px] w-[360px] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-16 -left-24 h-[300px] w-[300px] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-aipify-accent-muted bg-aipify-accent-soft px-4 py-1.5 text-sm font-medium text-aipify-companion">
            {labels.badge}
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            {labels.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary sm:text-lg">{labels.subtitle}</p>

          {outcomes && outcomes.length > 0 ? (
            <ul className="mx-auto mt-6 grid max-w-2xl gap-2 text-sm text-aipify-text-secondary sm:grid-cols-2">
              {outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-3 text-sm font-medium text-aipify-accent">{labels.notChatbot}</p>

          {previewItems && previewItems.length > 0 ? <PlatformPreviewStrip items={previewItems} /> : null}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
              className={`w-full sm:w-auto ${AipifyMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "hero_book_demo")}
            >
              {labels.ctaPrimary}
            </Link>
            <Link
              href={MARKETING_PRIMARY_CTA_HREFS.seeHowItWorks}
              className={`w-full sm:w-auto ${AipifyMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
              {...marketingDataAttr("cta_click", "hero_see_how_it_works")}
            >
              {labels.ctaSecondary}
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-aipify-border pt-6">
            <div>
              <dt className="text-xl font-bold text-aipify-text sm:text-2xl">{labels.statInstall}</dt>
              <dd className="mt-0.5 text-xs text-aipify-text-muted sm:text-sm">{labels.statInstallLabel}</dd>
            </div>
            <div>
              <dt className="text-xl font-bold text-aipify-text sm:text-2xl">{labels.statModules}</dt>
              <dd className="mt-0.5 text-xs text-aipify-text-muted sm:text-sm">{labels.statModulesLabel}</dd>
            </div>
            <div>
              <dt className="text-xl font-bold text-aipify-text sm:text-2xl">{labels.statControl}</dt>
              <dd className="mt-0.5 text-xs text-aipify-text-muted sm:text-sm">{labels.statControlLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";

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
};

export default function HeroSection({ labels }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-24 -left-24 h-[400px] w-[400px] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-aipify-accent-muted bg-aipify-accent-soft px-4 py-1.5 text-sm font-medium text-aipify-companion">
            {labels.badge}
          </span>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-aipify-text sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            {labels.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-aipify-text-secondary sm:text-xl">{labels.subtitle}</p>

          <p className="mt-4 text-sm font-medium text-aipify-accent">{labels.notChatbot}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/early-access"
              className={`w-full sm:w-auto ${AipifyMarketingClasses.primaryCta} px-8 py-4 text-base`}
              {...marketingDataAttr("cta_click", "hero_early_access")}
            >
              {labels.ctaPrimary}
            </Link>
            <a
              href="#how-it-works"
              className={`w-full sm:w-auto ${AipifyMarketingClasses.secondaryCta} px-8 py-4 text-base`}
              {...marketingDataAttr("cta_click", "hero_how_it_works")}
            >
              {labels.ctaSecondary}
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-1 gap-6 border-t border-aipify-border pt-10 sm:grid-cols-3">
            <div>
              <dt className="text-2xl font-bold text-aipify-text">{labels.statInstall}</dt>
              <dd className="mt-1 text-sm text-aipify-text-muted">{labels.statInstallLabel}</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-aipify-text">{labels.statModules}</dt>
              <dd className="mt-1 text-sm text-aipify-text-muted">{labels.statModulesLabel}</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-aipify-text">{labels.statControl}</dt>
              <dd className="mt-1 text-sm text-aipify-text-muted">{labels.statControlLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

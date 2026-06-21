import { PartnerAdvisorCard } from "@/components/marketing/PartnerAdvisorCard";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import GrowthPartnerApplicationForm from "./GrowthPartnerApplicationForm";
import type { GrowthPartnersPageContentProps } from "./types";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

type Props = GrowthPartnersPageContentProps & {
  verificationLabels: HumanVerificationLabels;
};

function KeyPointIcon({ index }: { index: number }) {
  const icons = ["◆", "◇", "○"];
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-aipify-accent-soft text-sm font-bold text-aipify-companion" aria-hidden="true">
      {icons[index] ?? "•"}
    </span>
  );
}

export default function GrowthPartnerHeroWithForm({ labels, verificationLabels }: Props) {
  const { hero, form, partnerAdvisor } = labels;

  return (
    <section id="apply" className="relative scroll-mt-20 overflow-hidden">
      <div className={AipifyMarketingClasses.heroGradient} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-0 h-[320px] w-[320px] rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute top-20 -left-20 h-[260px] w-[260px] rounded-full bg-indigo-50/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[44%_56%] lg:gap-12">
          <div className="max-w-xl">
            <span className={PublicMarketingClasses.eyebrow}>{hero.eyebrow}</span>
            <h1 className={`mt-5 ${PublicMarketingClasses.pageTitle}`}>{hero.headline}</h1>
            <p className="mt-5 text-lg leading-relaxed text-aipify-text-secondary">{hero.copy}</p>

            <ul className="mt-8 space-y-4">
              {hero.keyPoints.map((point, index) => (
                <li key={point.text} className="flex gap-3">
                  <KeyPointIcon index={index} />
                  <span className="text-sm leading-relaxed text-aipify-text-secondary">{point.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {hero.trustStatus.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-aipify-border bg-aipify-surface/80 px-3 py-1 text-xs font-medium text-aipify-text-secondary"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <PartnerAdvisorCard labels={partnerAdvisor} />
            </div>

            <div className="mt-8 rounded-2xl border border-aipify-border bg-aipify-surface/80 p-5">
              <h2 className="text-sm font-semibold text-aipify-text">{hero.whatHappensNext.title}</h2>
              <ol className="mt-3 space-y-2">
                {hero.whatHappensNext.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-aipify-text-secondary">
                    <span className="font-semibold text-aipify-companion">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="lg:pl-2">
            <GrowthPartnerApplicationForm labels={form} verificationLabels={verificationLabels} id="apply" />
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { PartnerAdvisorCard } from "@/components/marketing/PartnerAdvisorCard";
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
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#eeeafe,#e8eefc)] text-sm font-bold text-[#6042d4]"
      aria-hidden="true"
    >
      {icons[index] ?? "•"}
    </span>
  );
}

export default function GrowthPartnerHeroWithForm({ labels, verificationLabels }: Props) {
  const { hero, form, partnerAdvisor } = labels;

  return (
    <section id="apply" className="relative scroll-mt-20 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 8% 0%, rgba(115,87,232,.14), transparent 26rem), radial-gradient(circle at 92% 8%, rgba(85,119,242,.12), transparent 28rem), #f3f5fb",
        }}
      />
      <Image
        src="/brand/aipify-kompis-avatar.png"
        alt=""
        width={520}
        height={520}
        className="pointer-events-none absolute -left-24 bottom-[-60px] hidden w-[min(48vw,420px)] opacity-[0.14] lg:block"
        style={{
          transform: "rotate(-14deg)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 38%)",
          maskImage: "linear-gradient(90deg, transparent, #000 38%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[44%_56%] lg:gap-10">
          <div className="relative z-[1] max-w-xl">
            <span className={PublicMarketingClasses.eyebrow}>{hero.eyebrow}</span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#1f2235] sm:text-5xl sm:leading-[1.05]">
              {hero.headline}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#687086]">{hero.copy}</p>

            <ul className="mt-8 space-y-4">
              {hero.keyPoints.map((point, index) => (
                <li key={point.text} className="flex gap-3">
                  <KeyPointIcon index={index} />
                  <span className="text-sm leading-relaxed text-[#4a5163]">{point.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {hero.trustStatus.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[rgba(96,82,176,.15)] bg-white/85 px-3 py-1 text-xs font-medium text-[#5f51aa]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <PartnerAdvisorCard labels={partnerAdvisor} />
            </div>

            <div className="mt-6 rounded-[22px] border border-[rgba(96,82,176,.15)] bg-white/90 p-5 shadow-[0_12px_30px_rgba(38,33,87,.06)]">
              <h2 className="text-sm font-semibold text-[#1f2235]">{hero.whatHappensNext.title}</h2>
              <ol className="mt-3 space-y-2">
                {hero.whatHappensNext.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-[#687086]">
                    <span className="font-semibold text-[#7357e8]">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative z-[1] lg:pl-2">
            <GrowthPartnerApplicationForm labels={form} verificationLabels={verificationLabels} id="apply" />
          </div>
        </div>
      </div>
    </section>
  );
}

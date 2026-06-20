import Link from "next/link";
import GrowthPartnerCtaBand from "./GrowthPartnerCtaBand";
import GrowthPartnersSignupForm, { type GrowthPartnersSignupLabels } from "./GrowthPartnersSignupForm";
import { PublicPageHero } from "./public";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import PartnerAuthoritySection from "./PartnerAuthoritySection";
import PartnerPortalPreviewSection from "./PartnerPortalPreviewSection";
import PartnerSuccessStoriesSection from "./PartnerSuccessStoriesSection";
import PartnerTrustBuildersSection from "./PartnerTrustBuildersSection";
import { PartnerAdvisorCard, type PartnerAdvisorLabels } from "./PartnerAdvisorCard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

type Card = { title: string; body: string };
type Step = { title: string; time?: string; body: string };
type Tier = { title: string; body: string };

export type GrowthPartnersPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    trustLine: string;
    supporting: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badgeTime: string;
    badgeIndependent: string;
    badgeCertification: string;
    badgeProfessional: string;
  };
  positioning: { lines: string[] };
  why: { title: string; cards: Card[] };
  partnerJourney: { title: string; steps: string[] };
  certificationExperience: { title: string; intro: string; topics: string[] };
  partnerSupport: { title: string; items: string[] };
  commissionTransparency: { title: string; paragraphs: string[] };
  partnerBusinessModel: { title: string; paragraphs: string[]; activities: string[] };
  partnerSuccessStories: { title: string; emptyMessage: string; futureTypes: string[] };
  partnerPortalPreview: { title: string; items: string[] };
  trustBuilders: { title: string; items: string[] };
  registrationLeft: {
    benefitsTitle: string;
    benefits: string[];
    certificationTitle: string;
    certificationIntro: string;
    certificationTopics: string[];
    supportTitle: string;
    supportItems: string[];
    journeyTitle: string;
  };
  independentPartnership: {
    title: string;
    intro: string;
    partnerDecides: string[];
    aipifyProvidesTitle: string;
    aipifyProvides: string[];
  };
  howItWorks: { title: string; steps: Step[] };
  requirements: { title: string; items: string[]; copy: string };
  earnings: { title: string; copy: string; disclaimer: string; tiers: Tier[] };
  training: { title: string; modules: string[]; statusWaiting: string; statusVerified: string; certificationNote: string };
  growthPartnerCta: { title: string; applyLabel: string; speakLabel: string; learnMoreLabel: string };
  signup: GrowthPartnersSignupLabels;
  partnerAdvisor: PartnerAdvisorLabels;
  footerNote: string;
};

type Props = {
  labels: GrowthPartnersPageLabels;
  verificationLabels: HumanVerificationLabels;
  partnerAuthority?: {
    title: string;
    subtitle: string;
    badges: Array<{ name: string; description: string }>;
    stats: Array<{ value: string; label: string }>;
    ecosystemNote: string;
  };
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{children}</h2>;
}

function BenefitCard({ title, body }: Card) {
  return (
    <div className={AipifyMarketingClasses.card}>
      <h3 className="font-semibold text-aipify-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{body}</p>
    </div>
  );
}

function PartnerJourneyFlow({ title, steps }: { title: string; steps: string[] }) {
  return (
    <section id="partner-journey" aria-labelledby="partner-journey-title" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <SectionTitle>{title}</SectionTitle>
        <ol className="mt-10 space-y-0">
          {steps.map((step, index) => (
            <li key={step} className="flex flex-col items-center">
              <div className="w-full rounded-xl border border-violet-500/25 bg-violet-950/20 px-4 py-3 text-center text-sm font-medium text-violet-100">
                {step}
              </div>
              {index < steps.length - 1 ? (
                <span className="my-2 text-lg text-cyan-400/80" aria-hidden="true">
                  ↓
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CompactJourneyFlow({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ol className="mt-4 space-y-0">
        {steps.map((step, index) => (
          <li key={step} className="flex flex-col items-stretch">
            <div className="rounded-lg border border-aipify-border bg-white/[0.03] px-3 py-2 text-center text-xs font-medium text-aipify-text-secondary">
              {step}
            </div>
            {index < steps.length - 1 ? (
              <span className="my-1 text-center text-sm text-cyan-400/70" aria-hidden="true">
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function GrowthPartnersPageContent({ labels, verificationLabels, partnerAuthority }: Props) {
  const {
    hero,
    positioning,
    why,
    partnerJourney,
    certificationExperience,
    partnerSupport,
    commissionTransparency,
    partnerBusinessModel,
    partnerSuccessStories,
    partnerPortalPreview,
    trustBuilders,
    registrationLeft,
    independentPartnership,
    howItWorks,
    requirements,
    earnings,
    training,
    growthPartnerCta,
  } = labels;

  return (
    <>
      <PublicPageHero
        eyebrow={hero.badgeProfessional}
        title={hero.headline}
        subtitle={hero.subheadline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Growth Partners" },
        ]}
        primaryCta={{ label: hero.ctaPrimary, href: "#signup", analyticsId: "partners_hero_apply" }}
        secondaryCta={{ label: hero.ctaSecondary, href: "/contact", analyticsId: "partners_hero_contact" }}
        align="center"
      />

      {(hero.trustLine || hero.supporting) && (
        <div className="mx-auto -mt-6 max-w-3xl px-4 pb-6 text-center sm:px-6">
          {hero.trustLine ? (
            <p className="text-sm font-medium text-aipify-companion">{hero.trustLine}</p>
          ) : null}
          {hero.supporting ? <p className="mt-2 text-sm text-aipify-text-muted">{hero.supporting}</p> : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[hero.badgeIndependent, hero.badgeCertification, hero.badgeTime].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-aipify-border bg-aipify-surface px-3 py-1 text-xs font-medium text-aipify-text-secondary"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {partnerAuthority ? (
        <PartnerAuthoritySection
          title={partnerAuthority.title}
          subtitle={partnerAuthority.subtitle}
          badges={partnerAuthority.badges.map((b) => ({ label: b.name, description: b.description }))}
          stats={partnerAuthority.stats}
          ecosystemNote={partnerAuthority.ecosystemNote}
        />
      ) : null}

      {/* Positioning */}
      <section className="border-b border-white/10 bg-white/[0.02] py-10">
        <div className="mx-auto max-w-4xl space-y-3 px-4 text-center text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
          {positioning.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      {/* Why become */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{why.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {why.cards.map((card) => (
              <BenefitCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <PartnerJourneyFlow title={partnerJourney.title} steps={partnerJourney.steps} />

      {/* Certification */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{certificationExperience.title}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{certificationExperience.intro}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {certificationExperience.topics.map((topic) => (
              <li key={topic} className="flex items-center gap-2 rounded-xl border border-aipify-border bg-white/[0.03] px-4 py-3 text-sm text-aipify-text-secondary">
                <span className="text-cyan-400" aria-hidden="true">
                  •
                </span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner support */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{partnerSupport.title}</SectionTitle>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {partnerSupport.items.map((item) => (
              <li key={item} className="rounded-2xl border border-aipify-border bg-white/[0.03] px-5 py-4 text-center text-sm font-medium text-aipify-text-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Commission transparency */}
      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{commissionTransparency.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
            {commissionTransparency.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Partner business model */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{partnerBusinessModel.title}</SectionTitle>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
            {partnerBusinessModel.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {partnerBusinessModel.activities.map((activity) => (
              <li key={activity} className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-950/15 px-4 py-3 text-sm text-aipify-text-secondary">
                <span className="text-violet-400" aria-hidden="true">
                  •
                </span>
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PartnerPortalPreviewSection title={partnerPortalPreview.title} items={partnerPortalPreview.items} />

      <PartnerSuccessStoriesSection
        title={partnerSuccessStories.title}
        emptyMessage={partnerSuccessStories.emptyMessage}
        futureTypes={partnerSuccessStories.futureTypes}
      />

      {/* Premium registration */}
      <section id="signup" className="relative border-y border-white/10 bg-gradient-to-b from-violet-950/25 to-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="space-y-10 lg:pr-4">
              <div>
                <SectionTitle>{registrationLeft.benefitsTitle}</SectionTitle>
                <ul className="mt-6 space-y-3">
                  {registrationLeft.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-sm text-aipify-text-secondary sm:text-base">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{registrationLeft.certificationTitle}</h3>
                <p className="mt-2 text-sm text-aipify-text-secondary">{registrationLeft.certificationIntro}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {registrationLeft.certificationTopics.map((topic) => (
                    <li key={topic} className="text-xs text-aipify-text-muted sm:text-sm">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">{registrationLeft.supportTitle}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {registrationLeft.supportItems.map((item) => (
                    <li key={item} className="rounded-full border border-aipify-border bg-white/5 px-3 py-1.5 text-xs font-medium text-aipify-text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <CompactJourneyFlow title={registrationLeft.journeyTitle} steps={partnerJourney.steps} />
            </div>

            <div className="space-y-6 lg:pl-2">
              <PartnerAdvisorCard labels={labels.partnerAdvisor} />
              <PartnerTrustBuildersSection title={trustBuilders.title} items={trustBuilders.items} compact />
              <div className="rounded-2xl border border-aipify-border/80 bg-white/[0.02] p-6 sm:p-8">
                <GrowthPartnersSignupForm labels={labels.signup} verificationLabels={verificationLabels} />
              </div>
              <p className="text-center text-xs text-aipify-text-muted">
                <Link href="/login" className="text-cyan-400 hover:underline">
                  Already registered?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Independent partnership detail */}
      <section className="border-b border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{independentPartnership.title}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{independentPartnership.intro}</p>
          <ul className="mt-6 space-y-3">
            {independentPartnership.partnerDecides.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-semibold text-white">{independentPartnership.aipifyProvidesTitle}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {independentPartnership.aipifyProvides.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-xl border border-aipify-border bg-white/[0.03] px-4 py-3 text-sm text-aipify-text-secondary">
                <span className="text-cyan-400" aria-hidden="true">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works — detail */}
      <section id="how-it-works" className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{howItWorks.title}</SectionTitle>
          <ol className="mt-10 space-y-8">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} className="relative pl-12">
                <span className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-white">{step.title}</h3>
                {step.time ? <p className="mt-1 text-xs font-medium text-cyan-400/90">{step.time}</p> : null}
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Requirements */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{requirements.title}</SectionTitle>
          <ul className="mt-8 space-y-4 text-left">
            {requirements.items.map((item, i) => (
              <li key={item} className="rounded-xl border border-aipify-border bg-white/[0.03] px-5 py-4 text-sm text-aipify-text-secondary sm:text-base">
                <span className="font-semibold text-white">{i + 1}. </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-aipify-text-muted">{requirements.copy}</p>
        </div>
      </section>

      {/* Earnings tiers */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTitle>{earnings.title}</SectionTitle>
            <p className="mt-4 text-aipify-text-secondary">{earnings.copy}</p>
            <p className="mt-3 text-xs text-aipify-text-muted">{earnings.disclaimer}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {earnings.tiers.map((tier) => (
              <BenefitCard key={tier.title} {...tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{training.title}</SectionTitle>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ul className="space-y-2">
              {training.modules.map((mod) => (
                <li key={mod} className="flex items-center gap-2 text-sm text-aipify-text-secondary">
                  <span className="text-violet-400" aria-hidden="true">
                    •
                  </span>
                  {mod}
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">{training.statusWaiting}</div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-100">{training.statusVerified}</div>
              <p className="text-xs leading-relaxed text-aipify-text-muted">{training.certificationNote}</p>
            </div>
          </div>
        </div>
      </section>

      <GrowthPartnerCtaBand {...growthPartnerCta} />

      {/* Footer note + terms */}
      <section className="relative py-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm text-aipify-text-muted">{labels.footerNote}</p>
          <p className="mt-4">
            <Link href="/growth-partner-terms" className="text-sm font-medium text-cyan-400 hover:underline">
              Growth Partner Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import GrowthPartnersSignupForm, { type GrowthPartnersSignupLabels } from "./GrowthPartnersSignupForm";
import PartnerAuthoritySection from "./PartnerAuthoritySection";
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
  earlySignup: {
    title: string;
    paragraphs: string[];
    benefits: string[];
  };
  why: { title: string; cards: Card[] };
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
  positioning: { lines: string[] };
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
  return <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{children}</h2>;
}

function BenefitCard({ title, body }: Card) {
  return (
    <div className="rounded-2xl border border-aipify-border bg-white/[0.03] p-6 shadow-lg shadow-violet-900/10">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{body}</p>
    </div>
  );
}

export default function GrowthPartnersPageContent({ labels, verificationLabels, partnerAuthority }: Props) {
  const { hero, earlySignup, why, independentPartnership, howItWorks, requirements, earnings, training, positioning } = labels;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute top-48 -left-32 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-200">
              {hero.badgeTime}
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{hero.headline}</h1>
            <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary sm:text-lg">{hero.subheadline}</p>
            <p className="mt-4 text-sm font-medium text-cyan-300/90">{hero.trustLine}</p>
            <p className="mt-3 text-sm text-aipify-text-muted">{hero.supporting}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[hero.badgeIndependent, hero.badgeCertification, hero.badgeProfessional].map((badge) => (
                <span key={badge} className="rounded-full border border-aipify-border bg-white/5 px-3 py-1 text-xs font-medium text-aipify-text-secondary">
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#signup"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500 sm:w-auto"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-aipify-text transition hover:bg-white/10 sm:w-auto"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {partnerAuthority ? (
        <PartnerAuthoritySection
          title={partnerAuthority.title}
          subtitle={partnerAuthority.subtitle}
          badges={partnerAuthority.badges.map((b) => ({ label: b.name, description: b.description }))}
          stats={partnerAuthority.stats}
          ecosystemNote={partnerAuthority.ecosystemNote}
        />
      ) : null}

      {/* Early signup — two columns */}
      <section id="signup" className="relative border-b border-white/10 bg-gradient-to-b from-violet-950/20 to-transparent py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="lg:pr-4">
              <SectionTitle>{earlySignup.title}</SectionTitle>
              <div className="mt-8 space-y-5 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
                {earlySignup.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-10 space-y-4">
                {earlySignup.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-aipify-text-secondary sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8 lg:pl-2">
              <PartnerAdvisorCard labels={labels.partnerAdvisor} />
              <div className="rounded-2xl border border-aipify-border/80 bg-white/[0.02] p-6 sm:p-8">
                <GrowthPartnersSignupForm labels={labels.signup} verificationLabels={verificationLabels} />
              </div>
              <p className="text-center text-xs text-aipify-text-muted">
                <Link href="/login" className="text-cyan-400 hover:underline">Already registered?</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning strip */}
      <section className="border-b border-white/10 bg-white/[0.02] py-10">
        <div className="mx-auto max-w-4xl space-y-3 px-4 text-center text-sm leading-relaxed text-aipify-text-secondary sm:text-base">
          {positioning.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      {/* Why */}
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

      {/* Independent business partnership */}
      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
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
                <span className="text-cyan-400" aria-hidden="true">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
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

      {/* Earnings */}
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
                  <span className="text-violet-400" aria-hidden="true">•</span>
                  {mod}
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">
                <span aria-hidden="true">⏳ </span>
                {training.statusWaiting}
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-100">
                <span aria-hidden="true">🛡️ </span>
                {training.statusVerified}
              </div>
              <p className="text-xs leading-relaxed text-aipify-text-muted">{training.certificationNote}</p>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}

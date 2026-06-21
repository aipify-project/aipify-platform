import Link from "next/link";
import { PublicCard, PublicSection } from "./public";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import { marketingDataAttr } from "@/lib/marketing/analytics";

type IndustryExample = {
  industry: string;
  challenge: string;
  solution: string;
  outcome: string;
};

type OutcomeCard = {
  title: string;
  body: string;
};

type PartnerProfile = {
  profile: string;
  focus: string;
  outcome: string;
};

export type CustomerStoriesPageLabels = {
  meta: { title: string; description: string };
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    cta: string;
    ctaSecondary?: string;
  };
  sectionA: {
    title: string;
    subtitle: string;
    illustrativeLabel: string;
    featuredLabel: string;
    challengeLabel: string;
    solutionLabel: string;
    outcomeLabel: string;
    featured: IndustryExample;
    industries: IndustryExample[];
  };
  sectionB: {
    title: string;
    subtitle: string;
    items: OutcomeCard[];
  };
  sectionC: {
    headline: string;
    disclaimer: string;
    linkLabel: string;
    profiles: PartnerProfile[];
  };
  sectionD: {
    title: string;
    subtitle: string;
    description: string;
    validationLabel: string;
    highlights: string[];
    cta: string;
    ctaHref: string;
    statusLabel: string;
    statusNote: string;
  };
  sectionE: {
    title: string;
    subtitle: string;
    body: string;
    emptyTitle: string;
    emptyBody: string;
    notifyCta: string;
  };
  sectionF: {
    headline: string;
    subtitle: string;
    bookDemo: string;
    businessPacks: string;
    earlyAccess: string;
  };
};

type Props = { labels: CustomerStoriesPageLabels };

const OUTCOME_ICONS = ["⚙", "💬", "🛡", "📚", "📊", "🎯"] as const;

export default function CustomerStoriesPageContent({ labels }: Props) {
  const { sectionA, sectionB, sectionC, sectionD, sectionE, sectionF } = labels;

  return (
    <>
      <PublicSection id="industry-examples" title={sectionA.title} subtitle={sectionA.subtitle}>
        <p className={`${PublicMarketingClasses.scenarioBadge} mb-6`}>{sectionA.illustrativeLabel}</p>

        <article className={`${PublicMarketingClasses.card} mb-8 border-aipify-companion/20 bg-aipify-accent-soft/30`}>
          <p className={PublicMarketingClasses.cardLabel}>{sectionA.featuredLabel}</p>
          <h3 className={`${PublicMarketingClasses.cardTitle} mt-2 text-xl`}>{sectionA.featured.industry}</h3>
          <dl className="mt-6 grid gap-6 lg:grid-cols-3">
            <div>
              <dt className={PublicMarketingClasses.cardLabel}>{sectionA.challengeLabel}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{sectionA.featured.challenge}</dd>
            </div>
            <div>
              <dt className={PublicMarketingClasses.cardLabel}>{sectionA.solutionLabel}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{sectionA.featured.solution}</dd>
            </div>
            <div>
              <dt className={`${PublicMarketingClasses.cardLabel} text-aipify-companion`}>{sectionA.outcomeLabel}</dt>
              <dd className="mt-2 text-sm font-medium leading-relaxed text-aipify-text">{sectionA.featured.outcome}</dd>
            </div>
          </dl>
        </article>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sectionA.industries.map((item) => (
            <li key={item.industry} className={PublicMarketingClasses.card}>
              <h3 className={PublicMarketingClasses.cardTitle}>{item.industry}</h3>
              <p className={`${PublicMarketingClasses.cardLabel} mt-4`}>{sectionA.challengeLabel}</p>
              <p className="mt-1 text-sm text-aipify-text-secondary">{item.challenge}</p>
              <p className={`${PublicMarketingClasses.cardLabel} mt-4`}>{sectionA.solutionLabel}</p>
              <p className="mt-1 text-sm text-aipify-text-secondary">{item.solution}</p>
              <p className={`${PublicMarketingClasses.cardLabel} mt-4 text-aipify-companion`}>{sectionA.outcomeLabel}</p>
              <p className="mt-1 text-sm font-medium text-aipify-text">{item.outcome}</p>
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={sectionB.title} subtitle={sectionB.subtitle} alt>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sectionB.items.map((item, index) => (
            <li key={item.title}>
              <PublicCard
                title={item.title}
                description={item.body}
                icon={
                  <span className="text-base" aria-hidden="true">
                    {OUTCOME_ICONS[index % OUTCOME_ICONS.length]}
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={sectionC.headline} subtitle={sectionC.disclaimer}>
        <ul className="grid gap-5 lg:grid-cols-3">
          {sectionC.profiles.map((profile) => (
            <li key={profile.profile} className={PublicMarketingClasses.card}>
              <h3 className={PublicMarketingClasses.cardTitle}>{profile.profile}</h3>
              <p className="mt-2 text-sm text-aipify-text-secondary">{profile.focus}</p>
              <p className="mt-4 text-sm leading-relaxed text-aipify-text">{profile.outcome}</p>
            </li>
          ))}
        </ul>
        <Link href="/growth-partners" className={`mt-8 inline-block text-sm font-semibold ${PublicMarketingClasses.link}`}>
          {sectionC.linkLabel} →
        </Link>
      </PublicSection>

      <PublicSection title={sectionD.title} subtitle={sectionD.subtitle} alt>
        <div className={PublicMarketingClasses.card}>
          <p className="text-sm leading-relaxed text-aipify-text-secondary">{sectionD.description}</p>
          <p className={`${PublicMarketingClasses.cardLabel} mt-6`}>{sectionD.validationLabel}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sectionD.highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-lg border border-aipify-border bg-aipify-surface-muted px-4 py-3 text-sm text-aipify-text-secondary"
              >
                {highlight}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={sectionD.ctaHref}
              className={`inline-flex ${PublicMarketingClasses.primaryCta} px-5 py-2.5 text-sm`}
              {...marketingDataAttr("cta_click", "customer_stories_pilot")}
            >
              {sectionD.cta}
            </Link>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              {sectionD.statusLabel}
            </span>
          </div>
          <p className="mt-4 text-xs text-aipify-text-muted">{sectionD.statusNote}</p>
        </div>
      </PublicSection>

      <PublicSection title={sectionE.title} subtitle={sectionE.subtitle}>
        <div className={`${PublicMarketingClasses.comingSoon} mx-auto max-w-2xl px-6 py-10`}>
          <h3 className="text-lg font-semibold text-aipify-text">{sectionE.emptyTitle}</h3>
          <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{sectionE.emptyBody}</p>
          <p className="mt-4 text-sm leading-relaxed text-aipify-text-secondary">{sectionE.body}</p>
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.earlyAccess}
            className={`mt-6 inline-flex ${PublicMarketingClasses.secondaryCta} px-5 py-2.5 text-sm`}
            {...marketingDataAttr("cta_click", "customer_stories_early_access")}
          >
            {sectionE.notifyCta}
          </Link>
        </div>
      </PublicSection>

      <PublicSection id="get-started" title={sectionF.headline} subtitle={sectionF.subtitle} alt>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
            className={`${PublicMarketingClasses.primaryCta} px-7 py-3.5 text-base`}
            {...marketingDataAttr("cta_click", "customer_stories_final_demo")}
          >
            {sectionF.bookDemo}
          </Link>
          <Link
            href="/pricing#business-packs"
            className={`${PublicMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
            {...marketingDataAttr("cta_click", "customer_stories_final_packs")}
          >
            {sectionF.businessPacks}
          </Link>
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.earlyAccess}
            className={`${PublicMarketingClasses.secondaryCta} px-7 py-3.5 text-base`}
            {...marketingDataAttr("cta_click", "customer_stories_final_early_access")}
          >
            {sectionF.earlyAccess}
          </Link>
        </div>
      </PublicSection>
    </>
  );
}

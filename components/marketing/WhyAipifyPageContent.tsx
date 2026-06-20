import Link from "next/link";
import { PublicSection } from "./public";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type Card = { title: string; body: string };
type ComparisonColumn = { title: string; items: string[] };

export type WhyAipifyPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    supporting: string;
    cta: string;
  };
  problem: {
    headline: string;
    tools: string[];
    disconnected: string;
    supporting: string;
  };
  difference: {
    headline: string;
    cards: Card[];
  };
  builtForHumans: {
    headline: string;
    subheadline: string;
    supporting: string;
    positions: string[];
  };
  companion: {
    headline: string;
    traditional: ComparisonColumn;
    aipify: ComparisonColumn;
    examples: string[];
  };
  builtToGrow: {
    headline: string;
    steps: string[];
    supporting: string;
  };
  enterpriseReady: {
    headline: string;
    cards: Card[];
  };
  vision: {
    headline: string;
    supporting: string;
    stages: string[];
  };
  norway: {
    headline: string;
    subheadline: string;
    copy: string;
    footerQuote: string;
  };
  finalCta: {
    headline: string;
    explore: string;
    businessPacks: string;
    talkToSales: string;
  };
  finalPrinciple: string;
};

type Props = { labels: WhyAipifyPageLabels };

function InfoCard({ title, body }: Card) {
  return (
    <div className={PublicMarketingClasses.card}>
      <h3 className={PublicMarketingClasses.cardTitle}>{title}</h3>
      <p className={PublicMarketingClasses.cardBody}>{body}</p>
    </div>
  );
}

export default function WhyAipifyPageContent({ labels }: Props) {
  const { problem, difference, builtForHumans, companion, builtToGrow, enterpriseReady, vision, norway } = labels;

  return (
    <>
      <PublicSection title={problem.headline}>
        <div className="flex flex-wrap gap-3">
          {problem.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-2.5 text-sm font-medium text-aipify-text-secondary"
            >
              {tool}
            </span>
          ))}
        </div>
        <p className="mt-8 text-base font-medium text-aipify-text">{problem.disconnected}</p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-aipify-text-secondary">{problem.supporting}</p>
      </PublicSection>

      <PublicSection title={difference.headline} alt>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {difference.cards.map((card) => (
            <li key={card.title}>
              <InfoCard {...card} />
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={builtForHumans.headline} subtitle={builtForHumans.supporting}>
        <p className="-mt-6 mb-8 text-xl font-medium text-aipify-companion">{builtForHumans.subheadline}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {builtForHumans.positions.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
            >
              {item}
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={companion.headline} alt>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className={PublicMarketingClasses.card}>
            <h3 className="font-semibold text-aipify-text-secondary">{companion.traditional.title}</h3>
            <ul className="mt-4 space-y-2">
              {companion.traditional.items.map((item) => (
                <li key={item} className="text-sm text-aipify-text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-aipify-companion/30 bg-aipify-accent-soft/50 p-6 shadow-sm">
            <h3 className="font-semibold text-aipify-text">{companion.aipify.title}</h3>
            <ul className="mt-4 space-y-2">
              {companion.aipify.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-aipify-text-secondary">
                  <span className="text-aipify-companion" aria-hidden="true">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="mt-8 flex flex-wrap gap-3">
          {companion.examples.map((example) => (
            <li
              key={example}
              className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text-secondary"
            >
              {example}
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={builtToGrow.headline} subtitle={builtToGrow.supporting}>
        <ol className="mx-auto max-w-md space-y-3">
          {builtToGrow.steps.map((step) => (
            <li
              key={step}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-6 py-3 text-center text-base font-semibold text-aipify-text"
            >
              {step}
            </li>
          ))}
        </ol>
      </PublicSection>

      <PublicSection title={enterpriseReady.headline} alt>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {enterpriseReady.cards.map((card) => (
            <li key={card.title}>
              <InfoCard {...card} />
            </li>
          ))}
        </ul>
      </PublicSection>

      <PublicSection title={vision.headline} subtitle={vision.supporting}>
        <div className="flex flex-wrap gap-3">
          {vision.stages.map((stage) => (
            <span
              key={stage}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-5 py-3 text-sm font-semibold text-aipify-text"
            >
              {stage}
            </span>
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Bergen. Norway. For the world."
        title={norway.headline}
        subtitle={norway.subheadline}
        alt
      >
        <p className="-mt-6 max-w-2xl text-base leading-relaxed text-aipify-text-secondary">{norway.copy}</p>
        <blockquote className="mt-8 max-w-2xl border-l-4 border-aipify-companion/40 pl-6 text-base italic leading-relaxed text-aipify-text-secondary">
          {norway.footerQuote}
        </blockquote>
      </PublicSection>
    </>
  );
}

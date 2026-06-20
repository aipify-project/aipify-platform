import BookDemoRequestForm, { type BookDemoFormLabels } from "./BookDemoRequestForm";
import { DemoAdvisorCard } from "./DemoAdvisorCard";
import { PublicPageHero } from "./public";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import type { BookDemoAdvisor } from "@/lib/book-demo-discovery-center";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

type Card = { title: string; body: string };
type Step = { title: string; body: string };
type FaqItem = { question: string; answer: string };

export type BookDemoPageLabels = {
  meta: { title: string; description: string };
  hero: {
    headline: string;
    subheadline: string;
    supporting: string;
    cta: string;
  };
  whatToExpect: { title: string; steps: Step[] };
  whoShouldBook: { title: string; cards: Card[] };
  form: BookDemoFormLabels;
  advisor: {
    title: string;
    photoPlaceholder: string;
    role: string;
    availability: string;
    languages: string;
    contact: string;
    email: string;
  };
  enterpriseReadiness: { headline: string; cards: Card[] };
  deploymentModels: { title: string; cards: Card[] };
  faq: { title: string; items: FaqItem[] };
  companion: { headline: string; copy: string };
  finalPrinciple: string;
  breadcrumbs?: { home: string; bookDemo: string };
};

type Props = {
  labels: BookDemoPageLabels;
  advisor: BookDemoAdvisor | null;
  verificationLabels: HumanVerificationLabels;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">{children}</h2>;
}

function InfoCard({ title, body }: Card) {
  return (
    <div className={AipifyMarketingClasses.card}>
      <h3 className="font-semibold text-aipify-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{body}</p>
    </div>
  );
}

export default function BookDemoPageContent({ labels, advisor, verificationLabels }: Props) {
  const {
    hero,
    whatToExpect,
    whoShouldBook,
    form,
    advisor: advisorLabels,
    enterpriseReadiness,
    deploymentModels,
    faq,
    companion,
    finalPrinciple,
    breadcrumbs,
  } = labels;

  return (
    <>
      <PublicPageHero
        eyebrow="Aipify Business Operating System"
        title={hero.headline}
        subtitle={hero.subheadline}
        breadcrumbs={
          breadcrumbs
            ? [
                { label: breadcrumbs.home, href: "/" },
                { label: breadcrumbs.bookDemo },
              ]
            : undefined
        }
        primaryCta={{ label: hero.cta, href: "#schedule-demo", analyticsId: "book_demo_hero_cta" }}
        align="center"
      />

      {hero.supporting ? (
        <p className="mx-auto -mt-8 max-w-2xl px-4 pb-8 text-center text-sm leading-relaxed text-aipify-text-muted sm:px-6">
          {hero.supporting}
        </p>
      ) : null}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{whatToExpect.title}</SectionTitle>
          <ol className="mt-10 space-y-8">
            {whatToExpect.steps.map((step, i) => (
              <li key={step.title} className="relative pl-12">
                <span className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-aipify-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionTitle>{whoShouldBook.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whoShouldBook.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section id="schedule-demo" className="py-16 sm:py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className={`lg:col-span-3 ${AipifyMarketingClasses.card} p-6 sm:p-8`}>
              <BookDemoRequestForm labels={form} verificationLabels={verificationLabels} variant="light" />
            </div>
            <div className="lg:col-span-2">
              <DemoAdvisorCard advisor={advisor} labels={advisorLabels} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionTitle>{enterpriseReadiness.headline}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {enterpriseReadiness.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <SectionTitle>{deploymentModels.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deploymentModels.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${AipifyMarketingClasses.sectionAlt} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{faq.title}</SectionTitle>
          <dl className="mt-10 space-y-4">
            {faq.items.map((item) => (
              <div key={item.question} className={AipifyMarketingClasses.card}>
                <dt className="font-semibold text-aipify-text">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{companion.headline}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{companion.copy}</p>
        </div>
      </section>

      <section className="border-t border-aipify-border py-12">
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-aipify-text-muted">
          {finalPrinciple}
        </p>
        <p className="mt-4 text-center text-xs text-aipify-text-muted">Aipify Group AS · Bergen. Norway. For the world.</p>
      </section>
    </>
  );
}

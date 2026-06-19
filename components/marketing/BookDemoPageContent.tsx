import Link from "next/link";
import BookDemoRequestForm, { type BookDemoFormLabels } from "./BookDemoRequestForm";
import { DemoAdvisorCard } from "./DemoAdvisorCard";
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
};

type Props = {
  labels: BookDemoPageLabels;
  advisor: BookDemoAdvisor | null;
  verificationLabels: HumanVerificationLabels;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{children}</h2>;
}

function InfoCard({ title, body }: Card) {
  return (
    <div className="rounded-2xl border border-aipify-border bg-white/[0.03] p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{body}</p>
    </div>
  );
}

export default function BookDemoPageContent({ labels, advisor, verificationLabels }: Props) {
  const { hero, whatToExpect, whoShouldBook, form, advisor: advisorLabels, enterpriseReadiness, deploymentModels, faq, companion, finalPrinciple } = labels;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute top-48 -left-32 h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{hero.headline}</h1>
            <p className="mt-6 text-lg leading-relaxed text-aipify-text-secondary sm:text-xl">{hero.subheadline}</p>
            <p className="mt-4 text-sm leading-relaxed text-aipify-text-muted">{hero.supporting}</p>
            <a
              href="#schedule-demo"
              className="mt-10 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-aipify-text shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500"
            >
              {hero.cta}
            </a>
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{whatToExpect.title}</SectionTitle>
          <ol className="mt-10 space-y-8">
            {whatToExpect.steps.map((step, i) => (
              <li key={step.title} className="relative pl-12">
                <span className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{whoShouldBook.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whoShouldBook.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section id="schedule-demo" className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-2xl border border-aipify-border bg-white/[0.03] p-6 sm:p-8">
              <BookDemoRequestForm labels={form} verificationLabels={verificationLabels} />
            </div>
            <div className="lg:col-span-2">
              <DemoAdvisorCard advisor={advisor} labels={advisorLabels} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-violet-950/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{enterpriseReadiness.headline}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {enterpriseReadiness.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{deploymentModels.title}</SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deploymentModels.cards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>{faq.title}</SectionTitle>
          <dl className="mt-10 space-y-4">
            {faq.items.map((item) => (
              <div key={item.question} className="rounded-xl border border-aipify-border bg-white/[0.03] p-5">
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionTitle>{companion.headline}</SectionTitle>
          <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary sm:text-base">{companion.copy}</p>
        </div>
      </section>

      <section className="border-t border-aipify-border py-12">
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-aipify-text-muted">{finalPrinciple}</p>
        <p className="mt-4 text-center text-xs text-cyan-400/80">Aipify Group AS · Bergen. Norway. For the world.</p>
      </section>
    </div>
  );
}

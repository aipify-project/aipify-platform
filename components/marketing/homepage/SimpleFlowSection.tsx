import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepageFlowStep } from "@/lib/marketing/parse-homepage";

type SimpleFlowSectionProps = {
  title: string;
  subtitle: string;
  learnMore: string;
  steps: HomepageFlowStep[];
};

export default function SimpleFlowSection({ title, subtitle, learnMore, steps }: SimpleFlowSectionProps) {
  return (
    <section id="how-it-works" className={AipifyMarketingClasses.sectionAlt} aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 id="how-it-works-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
        </div>

        <ol className="mt-12 hidden lg:flex lg:items-stretch lg:gap-0">
          {steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-1 flex-col">
              <div className="flex items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span className="mx-2 h-0.5 flex-1 bg-aipify-border" aria-hidden="true" />
                ) : null}
              </div>
              <p className="mt-4 pr-4 text-base font-semibold text-aipify-text">{step.title}</p>
              <p className="mt-2 pr-4 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
            </li>
          ))}
        </ol>

        <ol className="mt-10 space-y-4 lg:hidden">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-aipify-border bg-aipify-surface p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-aipify-text">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Link
            href="/how-aipify-works"
            className="text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
            {...marketingDataAttr("cta_click", "how_it_works_learn_more")}
          >
            {learnMore} →
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepageFlowStep } from "@/lib/marketing/parse-homepage";
import HomepageSectionShell from "./HomepageSectionShell";

type SimpleFlowSectionProps = {
  title: string;
  subtitle: string;
  learnMore: string;
  permissionNote?: string;
  steps: HomepageFlowStep[];
};

export default function SimpleFlowSection({
  title,
  subtitle,
  learnMore,
  permissionNote = "",
  steps,
}: SimpleFlowSectionProps) {
  return (
    <HomepageSectionShell id="how-it-works" alt ariaLabelledBy="how-it-works-title">
      <div className="max-w-2xl">
        <h2 id="how-it-works-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
      </div>

      <ol className="mt-12 hidden lg:grid lg:grid-cols-6 lg:gap-4">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex flex-col">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aipify-companion text-sm font-bold text-white">
                {index + 1}
              </span>
              {index < steps.length - 1 ? (
                <span className="h-0.5 flex-1 bg-aipify-border" aria-hidden="true" />
              ) : null}
            </div>
            <p className="mt-4 text-base font-semibold text-aipify-text">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{step.description}</p>
          </li>
        ))}
      </ol>

      <ol className="mt-10 space-y-3 lg:hidden">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 rounded-xl border border-aipify-border bg-aipify-surface p-4">
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

      {permissionNote ? (
        <p className="mt-8 max-w-3xl rounded-xl border border-aipify-border bg-aipify-surface px-5 py-4 text-sm font-medium text-aipify-text">
          {permissionNote}
        </p>
      ) : null}

      <div className="mt-8">
        <Link
          href="/how-aipify-works"
          className="text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
          {...marketingDataAttr("cta_click", "how_it_works_learn_more")}
        >
          {learnMore} →
        </Link>
      </div>
    </HomepageSectionShell>
  );
}

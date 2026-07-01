import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepagePlanOverview } from "@/lib/marketing/parse-homepage";
import HomepageSectionShell from "./HomepageSectionShell";

type BuyingJourneySectionProps = {
  title: string;
  subtitle: string;
  footnote: string;
  comparePlans: string;
  plans: HomepagePlanOverview[];
};

export default function BuyingJourneySection({
  title,
  subtitle,
  footnote,
  comparePlans,
  plans,
}: BuyingJourneySectionProps) {
  return (
    <HomepageSectionShell alt ariaLabelledBy="buying-journey-title">
      <div className="max-w-2xl">
        <h2 id="buying-journey-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <li
            key={plan.name}
            className="rounded-2xl border border-aipify-border bg-aipify-surface px-5 py-6 shadow-sm"
          >
            <p className="text-lg font-semibold text-aipify-text">{plan.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{plan.description}</p>
          </li>
        ))}
      </ul>

      {footnote ? <p className="mt-6 max-w-3xl text-sm leading-relaxed text-aipify-text-secondary">{footnote}</p> : null}

      <div className="mt-8">
        <Link
          href="/pricing"
          className={`${AipifyMarketingClasses.secondaryCta} inline-flex`}
          {...marketingDataAttr("cta_click", "compare_plans")}
        >
          {comparePlans}
        </Link>
      </div>
    </HomepageSectionShell>
  );
}

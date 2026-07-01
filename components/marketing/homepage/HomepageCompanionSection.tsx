import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepageCompanionCapability } from "@/lib/marketing/parse-homepage";
import HomepageSectionShell from "./HomepageSectionShell";

type HomepageCompanionSectionProps = {
  title: string;
  subtitle: string;
  learnMore: string;
  capabilities: HomepageCompanionCapability[];
  appName: string;
};

export default function HomepageCompanionSection({
  title,
  subtitle,
  learnMore,
  capabilities,
  appName,
}: HomepageCompanionSectionProps) {
  return (
    <HomepageSectionShell alt ariaLabelledBy="companion-title">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <AipifyPulse size={44} variant="gradient" title={appName} aria-label={appName} />
            <span className="text-sm font-semibold text-aipify-companion">Aipify Companion</span>
          </div>
          <h2 id="companion-title" className="mt-5 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p>
          ) : null}
          <Link
            href="/companion"
            className="mt-6 inline-block text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
            {...marketingDataAttr("cta_click", "companion_learn_more")}
          >
            {learnMore} →
          </Link>
        </div>

        <ul className="grid gap-4">
          {capabilities.map((cap) => (
            <li key={cap.title} className="rounded-xl border border-aipify-border bg-aipify-surface px-5 py-4">
              <p className="font-semibold text-aipify-text">{cap.title}</p>
              {cap.description ? (
                <p className="mt-1.5 text-sm leading-relaxed text-aipify-text-secondary">{cap.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </HomepageSectionShell>
  );
}

import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { HomepageCompanionCapability } from "@/lib/marketing/parse-homepage";

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
    <section className={AipifyMarketingClasses.sectionAlt} aria-labelledby="companion-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <AipifyPulse size={40} variant="gradient" title={appName} aria-label={appName} />
              <span className="text-sm font-semibold text-aipify-companion">Aipify Companion</span>
            </div>
            <h2 id="companion-title" className="mt-5 text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p>
            ) : null}
            <Link
              href="/product#companion"
              className="mt-6 inline-block text-sm font-semibold text-aipify-accent hover:text-aipify-companion"
              {...marketingDataAttr("cta_click", "companion_learn_more")}
            >
              {learnMore} →
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((cap) => (
              <li
                key={cap.title}
                className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3.5"
              >
                <p className="font-semibold text-aipify-text">{cap.title}</p>
                {cap.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{cap.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

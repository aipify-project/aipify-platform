import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import HomepageSectionShell from "./HomepageSectionShell";

type HomepageTrustSectionProps = {
  title: string;
  subtitle: string;
  exploreEnterprise: string;
  points: { title: string; description: string }[];
};

const TRUST_ICONS = [
  "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 015.856-.167m10.5 0a48.471 48.471 0 015.856.167",
  "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.467.732-3.562",
];

export default function HomepageTrustSection({
  title,
  subtitle,
  exploreEnterprise,
  points,
}: HomepageTrustSectionProps) {
  return (
    <HomepageSectionShell ariaLabelledBy="enterprise-trust-title">
      <div className="max-w-2xl">
        <h2 id="enterprise-trust-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((point, i) => (
          <li key={point.title} className="rounded-2xl border border-aipify-border bg-aipify-surface p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-aipify-border bg-aipify-surface-muted">
              <svg
                className="h-5 w-5 text-aipify-companion"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={TRUST_ICONS[i % TRUST_ICONS.length]} />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-aipify-text">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{point.description}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link
          href="/enterprise"
          className={`${AipifyMarketingClasses.secondaryCta} inline-flex`}
          {...marketingDataAttr("cta_click", "explore_enterprise")}
        >
          {exploreEnterprise}
        </Link>
      </div>
    </HomepageSectionShell>
  );
}

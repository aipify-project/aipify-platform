import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";

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
  "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
];

export default function HomepageTrustSection({
  title,
  subtitle,
  exploreEnterprise,
  points,
}: HomepageTrustSectionProps) {
  return (
    <section aria-labelledby="enterprise-trust-title">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 id="enterprise-trust-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point, i) => (
            <li
              key={point.title}
              className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aipify-accent-soft">
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
              <p className="mt-2 text-base leading-relaxed text-aipify-text-secondary">{point.description}</p>
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
      </div>
    </section>
  );
}

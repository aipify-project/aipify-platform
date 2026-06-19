"use client";

import Link from "next/link";
import { buildWebsiteHealthReport, getWebsiteGovernanceBundle } from "@/lib/marketing/governance/health";
import {
  APPROVED_BRAND_TERMS,
  FORBIDDEN_BRAND_TERMS,
  PUBLIC_WEBSITE_PRINCIPLES,
  TRANSITION_FOCUS_AREAS,
  WEBSITE_DESIGN_GOVERNANCE,
  WEBSITE_GOVERNANCE_RULES,
} from "@/lib/marketing/governance/constants";

type WebsiteGovernancePanelProps = {
  labels: {
    title: string;
    subtitle: string;
    governanceTitle: string;
    brandLanguageTitle: string;
    designTitle: string;
    healthTitle: string;
    completionTitle: string;
    principleTitle: string;
    transitionTitle: string;
    approvedTerms: string;
    forbiddenTerms: string;
    rules: string;
    principles: string;
    transitionNote: string;
    websiteIntelligenceLink: string;
    checkpoints: Record<string, string>;
    healthChecks: Record<string, string>;
  };
};

export function WebsiteGovernancePanel({ labels }: WebsiteGovernancePanelProps) {
  const health = buildWebsiteHealthReport({ localizedLocales: 4 });
  const governance = getWebsiteGovernanceBundle();

  return (
    <div className="space-y-8 p-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-4">
          <Link href="/platform/website-intelligence" className="text-sm font-medium text-indigo-600 hover:underline">
            {labels.websiteIntelligenceLink}
          </Link>
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.rules}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {WEBSITE_GOVERNANCE_RULES.map((rule) => (
            <li key={rule} className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-700">
              {rule.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.brandLanguageTitle}</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">{labels.approvedTerms}</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {APPROVED_BRAND_TERMS.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-gray-500">{labels.forbiddenTerms}</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {FORBIDDEN_BRAND_TERMS.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.designTitle}</h2>
        <dl className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
          <div>
            <dt className="font-medium">Canvas</dt>
            <dd>{WEBSITE_DESIGN_GOVERNANCE.primaryTheme.canvas}</dd>
          </div>
          <div>
            <dt className="font-medium">Companion Purple</dt>
            <dd>{WEBSITE_DESIGN_GOVERNANCE.primaryTheme.companionPurple}</dd>
          </div>
          <div>
            <dt className="font-medium">Principles</dt>
            <dd>{WEBSITE_DESIGN_GOVERNANCE.principles.join(" · ")}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.completionTitle}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {health.completion.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm text-emerald-900">
              <span aria-hidden="true">{item.complete ? "✓" : "○"}</span>
              {labels.checkpoints[item.id] ?? item.id}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.healthTitle}</h2>
        <ul className="mt-4 space-y-3">
          {health.checks.map((check) => (
            <li key={check.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{labels.healthChecks[check.id] ?? check.id}</p>
              <p className="mt-1 text-gray-600">{check.summary}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{check.status}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.principleTitle}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-indigo-900">
          {PUBLIC_WEBSITE_PRINCIPLES.map((p) => (
            <li key={p} className="capitalize">
              {p.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">{labels.transitionTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.transitionNote}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {TRANSITION_FOCUS_AREAS.map((area) => (
            <li key={area} className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-700">
              {area.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-500">Governance v{governance.version} · {governance.routes.length} public routes</p>
      </section>
    </div>
  );
}

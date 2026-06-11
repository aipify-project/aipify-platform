"use client";

import Link from "next/link";
import { DEVELOPER_PORTAL_INFO, SANDBOX_RESTRICTIONS, SDK_VERSION, defineAipifySkill } from "@/lib/aipify/app-ecosystem";

type DeveloperPortalPanelProps = {
  labels: Record<string, string>;
};

const EXAMPLE_MANIFEST = defineAipifySkill({
  key: "support.sentiment",
  name: "Support Sentiment",
  permissions: ["support.read"],
  risk_level: "medium",
});

export function DeveloperPortalPanel({ labels }: DeveloperPortalPanelProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-lg font-semibold text-teal-900">{labels.welcome}</h2>
        <p className="mt-2 text-sm text-gray-700">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-teal-700">SDK v{SDK_VERSION}</p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.gettingStarted}</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-gray-700">
          {DEVELOPER_PORTAL_INFO.publishing_steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section id="manifest">
        <h2 className="text-sm font-semibold text-gray-900">{labels.manifestSpec}</h2>
        <p className="mt-2 text-sm text-gray-600">{labels.manifestHint}</p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs">
          {JSON.stringify(EXAMPLE_MANIFEST, null, 2)}
        </pre>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.sandboxTitle}</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-700">
          {SANDBOX_RESTRICTIONS.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="text-teal-600">•</span>
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.partnerTiers}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {DEVELOPER_PORTAL_INFO.partner_tiers.map((tier) => (
            <div key={tier} className="rounded border border-gray-200 px-3 py-2 text-sm capitalize">
              {tier.replace(/_/g, " ")}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.resources}</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/app/apps" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
            {labels.appRegistry}
          </Link>
          <Link href="/app/marketplace" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
            {labels.marketplace}
          </Link>
          <Link href="/app/knowledge-center" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
            {labels.knowledgeCenter}
          </Link>
        </div>
      </section>

      <p className="text-xs text-gray-500">{labels.governanceNote}</p>
    </div>
  );
}

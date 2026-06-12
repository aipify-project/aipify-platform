"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSecurityTrustEngineDashboard,
  type AccessPrinciple,
  type CompanionExample,
  type ResilienceObjective,
  type SecurityObjective,
  type SecurityTrustEngineDashboard,
} from "@/lib/aipify/security-trust-engine";

type Props = { labels: Record<string, string> };

function ObjectiveItem({ item }: { item: SecurityObjective | ResilienceObjective | AccessPrinciple }) {
  return (
    <li className="text-sm text-gray-600">
      <span className="font-medium text-gray-800">{item.label}</span>
      {item.description ? <span className="text-gray-500"> — {item.description}</span> : null}
    </li>
  );
}

function CompanionExampleItem({ example }: { example: CompanionExample }) {
  return (
    <li className="text-sm text-slate-800">
      {example.emoji ? `${example.emoji} ` : ""}
      {example.example}
    </li>
  );
}

export function SecurityTrustEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<SecurityTrustEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/security-trust-engine/dashboard");
    if (res.ok) setDashboard(parseSecurityTrustEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{labels.engineTitle}</h2>
        {dashboard.mission ? <p className="mt-2 text-sm text-slate-700">{dashboard.mission}</p> : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-slate-600">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs font-medium text-slate-500">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-3 text-xs text-slate-500">{dashboard.distinction_note}</p>
        ) : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.complianceScore}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.compliance_score ?? engagement?.compliance_score ?? "—")}%
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.pendingReviews}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.pending_reviews ?? engagement?.pending_access_reviews ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activePolicies}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(summary.active_policies ?? engagement?.active_policies ?? 0)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.resiliencePlans}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {String(engagement?.resilience_plans ?? 0)}
          </p>
        </div>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.security_objectives && dashboard.security_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.securityObjectives}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.security_objectives.map((item) => (
              <ObjectiveItem key={String(item.key ?? item.label)} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.resilience_objectives && dashboard.resilience_objectives.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.resilienceObjectives}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.resilience_objectives.map((item) => (
              <ObjectiveItem key={String(item.key ?? item.label)} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.access_principles && dashboard.access_principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.accessPrinciples}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.access_principles.map((item) => (
              <ObjectiveItem key={String(item.key ?? item.label)} item={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.companion_examples && dashboard.companion_examples.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{labels.companionExamples}</h3>
          <ul className="mt-2 space-y-2">
            {dashboard.companion_examples.map((item) => (
              <CompanionExampleItem key={item.key ?? item.example} example={item} />
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(dashboard.blueprint_success_criteria) && dashboard.blueprint_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note ? <p className="text-xs text-gray-500">{note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.trust_connection_blueprint?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnectionBlueprint}</h3>
          <p className="mt-2 text-gray-600">{dashboard.trust_connection_blueprint.principle}</p>
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-gray-500">{labels.complianceChecks}</dt>
              <dd className="font-medium">
                {engagement.compliance_passed ?? 0}/{engagement.compliance_total ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.openVulnerabilities}</dt>
              <dd className="font-medium">{engagement.open_vulnerabilities ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.resilienceSimulations}</dt>
              <dd className="font-medium">{engagement.resilience_simulations ?? 0}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">{labels.trustTransparency}</dt>
              <dd className="font-medium">
                {engagement.trust_transparency_enabled ? labels.enabled : labels.disabled}
              </dd>
            </div>
          </dl>
          {engagement.privacy_note ? <p className="mt-2 text-xs text-gray-500">{engagement.privacy_note}</p> : null}
        </section>
      ) : null}

      {dashboard.compliance_checks && dashboard.compliance_checks.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.complianceChecksSection}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.compliance_checks.map((check) => (
              <li key={String(check.id ?? check.check_key)} className="flex items-center justify-between">
                <span>{check.check_name ?? check.check_key}</span>
                <span className={check.passed ? "text-green-700" : "text-amber-700"}>
                  {check.passed ? labels.passed : labels.pending}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_integration_links && dashboard.blueprint_integration_links.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.blueprint_integration_links.map((link) => (
              <li key={String(link.key ?? link.route)}>
                {link.route ? (
                  <Link href={link.route} className="font-medium text-teal-700 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-500">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.privacy_note ? <p className="text-xs text-gray-500">{dashboard.privacy_note}</p> : null}
    </div>
  );
}

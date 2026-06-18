"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseIntegrationEngineDashboard,
  type ExecutiveInsightExample,
  type FinancialPrinciple,
  type IntegrationEngineDashboard,
} from "@/lib/aipify/integration-engine";

type IntegrationEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function PrincipleCard({ principle }: { principle: FinancialPrinciple }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{principle.label}</span>
      {principle.description ? <p className="mt-1 text-xs text-gray-600">{principle.description}</p> : null}
    </div>
  );
}

function ExecutiveExampleCard({ example }: { example: ExecutiveInsightExample }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      {example.scenario ? <p className="text-xs font-medium text-emerald-900">{example.scenario}</p> : null}
      {example.example ? <p className="mt-1 text-xs text-emerald-800">{example.example}</p> : null}
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "failed":
      return "bg-rose-100 text-rose-800";
    case "disabled":
    case "archived":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function IntegrationEngineDashboardPanel({ labels }: IntegrationEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<IntegrationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/integration-engine/dashboard");
    if (res.ok) setDashboard(parseIntegrationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(id: string, action: "sync" | "disable") {
    setActionId(id);
    await fetch(`/api/integrations/${id}/${action}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  async function connectUnonight() {
    setActionId("unonight");
    await fetch("/api/integrations/unonight/connect", { method: "POST", body: "{}" });
    await load();
    setActionId(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const health = dashboard.health_summary ?? {};
  const pilot = dashboard.unonight_pilot;

  return (
    <div className="space-y-6">
      {(dashboard.integration_links ?? []).length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {dashboard.integration_links?.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.aipifyCore}
          </Link>
          <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.supportAi}
          </Link>
          <Link href="/app/audit-accountability" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.auditAccountability}
          </Link>
        </div>
      )}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.integrationEngine}</h2>
        {dashboard.mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
        {dashboard.integration_engine_note ? (
          <p className="mt-1 text-xs text-violet-700">{dashboard.integration_engine_note}</p>
        ) : null}
        {dashboard.safety_note ? (
          <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
        ) : null}
      </section>

      {dashboard.financial_operations_note ? (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <h2 className="text-sm font-semibold text-emerald-900">{labels.financialOperations}</h2>
          {dashboard.blueprint_mission ? (
            <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.blueprint_mission}</p>
          ) : null}
          {dashboard.blueprint_philosophy ? (
            <p className="mt-2 text-sm text-emerald-900">{dashboard.blueprint_philosophy}</p>
          ) : null}
          {dashboard.blueprint_abos_principle ? (
            <p className="mt-2 text-xs text-emerald-800">{dashboard.blueprint_abos_principle}</p>
          ) : null}
          <p className="mt-1 text-xs text-emerald-700">{dashboard.financial_operations_note}</p>
        </section>
      ) : null}

      {dashboard.primary_strategy?.systems && dashboard.primary_strategy.systems.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.primaryStrategy}</h3>
          {dashboard.primary_strategy.principle ? (
            <p className="mt-2 text-sm text-gray-600">{dashboard.primary_strategy.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.primary_strategy.systems.map((system) => (
              <div key={system.key ?? system.name} className="rounded-lg border border-emerald-100 bg-emerald-50/30 px-3 py-2">
                <p className="text-sm font-medium text-emerald-900">
                  {system.emoji ? `${system.emoji} ` : ""}
                  {system.name}
                </p>
                {system.note ? <p className="mt-1 text-xs text-emerald-800">{system.note}</p> : null}
              </div>
            ))}
          </div>
          {dashboard.primary_strategy.coordination_note ? (
            <p className="mt-3 text-xs text-gray-600">{dashboard.primary_strategy.coordination_note}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.financial_principles && dashboard.financial_principles.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.financialPrinciples}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.financial_principles.map((principle) => (
              <PrincipleCard key={principle.key ?? principle.label} principle={principle} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.aipify_may && dashboard.aipify_may.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.aipifyMay}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
            {dashboard.aipify_may.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.blueprint_boundaries?.should_not_become &&
      dashboard.blueprint_boundaries.should_not_become.length > 0 ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold text-amber-900">{labels.blueprintBoundaries}</h3>
          {dashboard.blueprint_boundaries.principle ? (
            <p className="mt-2 text-sm text-amber-900">{dashboard.blueprint_boundaries.principle}</p>
          ) : null}
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-amber-800">
            {dashboard.blueprint_boundaries.should_not_become.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.executive_insight_examples && dashboard.executive_insight_examples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.executiveExamples}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.executive_insight_examples.map((example) => (
              <ExecutiveExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.engagement_summary ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-500">{labels.stripeActive}</p>
              <p className="mt-1 font-medium">{dashboard.engagement_summary.stripe_active ? labels.yes : labels.no}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-500">{labels.stripeWebhooks}</p>
              <p className="mt-1 font-medium">{dashboard.engagement_summary.stripe_webhooks ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-500">{labels.fikenScaffold}</p>
              <p className="mt-1 font-medium">
                {dashboard.engagement_summary.fiken_catalog_scaffold ? labels.yes : labels.no}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-500">{labels.financialWebhooks}</p>
              <p className="mt-1 font-medium">{dashboard.engagement_summary.financial_webhooks ?? 0}</p>
            </div>
          </div>
        </section>
      ) : null}

      {(dashboard.blueprint_integration_links ?? []).length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintIntegrationLinks}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.blueprint_integration_links?.map((link) =>
              link.route ? (
                <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                  {link.label}
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
        </section>
      ) : null}

      {dashboard.financial_trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.financialTrust}</h3>
          <p className="mt-2 text-gray-700">{dashboard.financial_trust_connection.principle}</p>
        </section>
      ) : null}

      {Array.isArray(dashboard.financial_operations_success_criteria) &&
      dashboard.financial_operations_success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.financialSuccessCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.financial_operations_success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label}>
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {item.note ? <p className="text-xs text-gray-500">{item.note}</p> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-emerald-900">
            {dashboard.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.platform_priorities && dashboard.platform_priorities.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.platformPriorities}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.platform_priorities.map((group) => (
              <div key={group.category ?? group.label} className="rounded-lg border border-violet-100 bg-violet-50/30 px-3 py-2">
                <p className="text-sm font-medium text-violet-900">{group.label}</p>
                {group.integrations && group.integrations.length > 0 ? (
                  <ul className="mt-1 flex flex-wrap gap-1">
                    {group.integrations.map((name) => (
                      <li key={name} className="rounded-full bg-white px-2 py-0.5 text-xs text-violet-800">
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label}>
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

      {dashboard.self_love_note ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          {dashboard.self_love_note}
        </section>
      ) : null}

      {dashboard.trust_connection ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          {dashboard.trust_connection.principle ? (
            <p className="mt-2 text-gray-600">{dashboard.trust_connection.principle}</p>
          ) : null}
          {dashboard.trust_connection.disable_path ? (
            <p className="mt-2 text-xs text-gray-500">{dashboard.trust_connection.disable_path}</p>
          ) : null}
        </section>
      ) : null}

      {dashboard.connector_architecture?.note ? (
        <section className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-800">{labels.connectorArchitecture}: </span>
          {dashboard.connector_architecture.note}
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.active ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.failedIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.failed ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.pending ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.disabledIntegrations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{health.disabled ?? 0}</p>
        </div>
      </section>

      <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-violet-900">{labels.unonightPilot}</h2>
            <p className="mt-1 text-xs text-violet-700">
              {pilot?.connected ? labels.unonightConnected : labels.unonightNotConnected}
              {pilot?.last_sync_at ? ` · ${labels.lastSync}: ${new Date(pilot.last_sync_at).toLocaleString()}` : ""}
            </p>
          </div>
          {!pilot?.connected ? (
            <button
              type="button"
              disabled={actionId === "unonight"}
              onClick={() => void connectUnonight()}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              {labels.connectUnonight}
            </button>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.connectedIntegrations}</h2>
        {dashboard.connected_integrations.length === 0 ? (
          <p className="mt-3 text-xs text-gray-500">{labels.noIntegrations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {dashboard.connected_integrations.map((i) => (
              <li key={i.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">{i.integration_name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(i.status)}`}>
                    {i.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {i.integration_key}
                  {i.last_sync_at ? ` · ${labels.lastSync}: ${new Date(i.last_sync_at).toLocaleString()}` : ""}
                  {i.has_credentials ? ` · ${labels.credentialsStored}` : ""}
                </p>
                {i.last_error ? <p className="mt-1 text-xs text-rose-600">{i.last_error}</p> : null}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={actionId === i.id}
                    onClick={() => void runAction(i.id, "sync")}
                    className="rounded border border-violet-200 px-2 py-0.5 text-xs text-violet-800 disabled:opacity-50"
                  >
                    {labels.sync}
                  </button>
                  {i.enabled ? (
                    <button
                      type="button"
                      disabled={actionId === i.id}
                      onClick={() => void runAction(i.id, "disable")}
                      className="rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-700 disabled:opacity-50"
                    >
                      {labels.disable}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.pending_actions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-amber-800">{labels.pendingActions}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.pending_actions.map((a) => (
              <li key={a.id} className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
                <span className="font-medium">{a.integration_name}</span>
                <p className="text-xs text-amber-700">{a.warning}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentFailures}</h2>
          {dashboard.recent_failures.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noFailures}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.recent_failures.map((f) => (
                <li key={f.id} className="rounded-lg border border-rose-100 bg-rose-50/30 px-3 py-2 text-sm">
                  <p className="text-rose-800">{f.error_message}</p>
                  <p className="text-xs text-gray-500">
                    {f.sync_type} · retries {f.retry_count ?? 0}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentWebhooks}</h2>
          {dashboard.recent_webhooks.length === 0 ? (
            <p className="mt-3 text-xs text-gray-500">{labels.noWebhooks}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {dashboard.recent_webhooks.map((w) => (
                <li key={w.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium">{w.event_type}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(w.status)}`}>
                    {w.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {dashboard.catalog.filter((c) => c.is_future).length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.futureIntegrations}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.catalog
              .filter((c) => c.is_future)
              .map((c) => (
                <span key={c.integration_key} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {c.integration_name}
                </span>
              ))}
          </div>
        </section>
      ) : null}

      {dashboard.integration_principles && dashboard.integration_principles.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.integrationPrinciples}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-violet-800">
            {dashboard.integration_principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles && dashboard.principles.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4">
          <h2 className="text-sm font-semibold text-violet-900">{labels.principles}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-violet-800">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

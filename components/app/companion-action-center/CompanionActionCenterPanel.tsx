"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCompanionActionCenter,
  filterActionsByStatus,
  type CompanionActionCenter,
} from "@/lib/companion-action-center-engine/parse";
import type { Care593Section } from "@/lib/companion-action-center-engine/config";
import { care593SectionToRpc } from "@/lib/companion-action-center-engine/config";
import type { buildCompanionActionCenterLabels } from "@/lib/companion-action-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionActionCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

function riskLabel(labels: Labels, risk: unknown): string {
  const key = String(risk ?? "medium") as keyof Labels["riskLevel"];
  return labels.riskLevel[key] ?? String(risk);
}

export function CompanionActionCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Care593Section;
}) {
  const [center, setCenter] = useState<CompanionActionCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = care593SectionToRpc(activeSection);
    const res = await fetch(`/api/companion-action-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseCompanionActionCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const exec = center.executive_dashboard ?? {};
  const registry = center.registry ?? [];

  const renderActions = (actions: Record<string, unknown>[]) =>
    actions.length === 0 ? (
      <p className="text-sm text-zinc-600">{labels.noRecords}</p>
    ) : (
      actions.map((a) => (
        <ItemCard
          key={String(a.action_key)}
          title={String(a.action_title)}
          summary={String(a.summary || a.outcome_summary || "")}
          badge={`${riskLabel(labels, a.risk_level)} · ${String(a.action_status ?? "")}`}
          extra={
            <p className="mt-1 text-xs text-zinc-500">
              {String(a.requester_label ?? "")} → {String(a.approver_label ?? "")}
              {a.business_pack ? ` · ${String(a.business_pack)}` : ""}
            </p>
          }
        />
      ))
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-amber-100 bg-amber-50/70 px-5 py-4 text-sm text-amber-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.executiveDashboard}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={labels.executive.pendingApprovals} value={exec.pending_approvals ?? 0} />
            <StatCard label={labels.executive.highRiskActions} value={exec.high_risk_actions ?? 0} />
            <StatCard label={labels.executive.completedActions} value={exec.completed_actions ?? 0} />
            <StatCard label={labels.executive.failedActions} value={exec.failed_actions ?? 0} />
            <StatCard label={labels.executive.actionVolume} value={exec.action_volume ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={labels.stats.registryActions} value={stats.registry_actions ?? 0} />
          <StatCard label={labels.stats.pending} value={stats.pending ?? 0} />
          <StatCard label={labels.stats.approved} value={stats.approved ?? 0} />
          <StatCard label={labels.stats.completed} value={stats.completed ?? 0} />
          <StatCard label={labels.stats.templates} value={stats.templates ?? 0} />
          <StatCard label={labels.stats.safetyRules} value={stats.safety_rules ?? 0} />
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.action_title ?? "Insight")}
              summary={String(rec.recommendation ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "overview" && (center.execution_flow?.length ?? 0) > 0 && (
        <section className="rounded-xl border border-amber-100 bg-white p-4">
          <h3 className="font-semibold text-zinc-900">{labels.executionFlow}</h3>
          <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
            {(center.execution_flow ?? []).map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                {i > 0 ? <span>↓</span> : null}
                <span className="rounded bg-amber-50 px-2 py-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {activeSection === "overview" && (center.business_packs?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {(center.business_packs ?? []).map((pack) => (
              <ItemCard
                key={String(pack.pack_key)}
                title={String(pack.pack_title)}
                summary={String(pack.summary ?? "")}
                badge={`${String(pack.actions_count ?? 0)} actions · ${String(pack.templates_count ?? 0)} templates`}
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "pending" && <section className="grid gap-3">{renderActions(filterActionsByStatus(registry, "pending"))}</section>}
      {activeSection === "approved" && <section className="grid gap-3">{renderActions(filterActionsByStatus(registry, "approved"))}</section>}
      {activeSection === "completedActions" && (
        <section className="grid gap-3">{renderActions(filterActionsByStatus(registry, "completed"))}</section>
      )}

      {activeSection === "approvals" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.approval_matrix ?? []).map((m) => (
              <ItemCard
                key={String(m.matrix_key)}
                title={String(m.approval_path)}
                summary={String(m.execution_rule || m.summary || "")}
                badge={riskLabel(labels, m.risk_level)}
              />
            ))}
          </div>
          {(center.confirmations ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.confirmationSystem}</h3>
              {(center.confirmations ?? []).map((c) => (
                <div key={String(c.confirmation_key)} className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-zinc-900">{String(c.action_title)}</p>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div><dt className="text-xs uppercase text-zinc-500">Impact</dt><dd className="text-zinc-700">{String(c.impact_summary ?? "")}</dd></div>
                    <div><dt className="text-xs uppercase text-zinc-500">Cost</dt><dd className="text-zinc-700">{String(c.cost_summary ?? "")}</dd></div>
                    <div><dt className="text-xs uppercase text-zinc-500">Approvals</dt><dd className="text-zinc-700">{String(c.approvals_summary ?? "")}</dd></div>
                    <div><dt className="text-xs uppercase text-zinc-500">Systems</dt><dd className="text-zinc-700">{String(c.external_systems ?? "")}</dd></div>
                  </dl>
                  <p className="mt-2 text-sm text-zinc-600">{String(c.expected_outcome ?? "")}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "permissions" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.permissions ?? []).map((p) => (
              <ItemCard
                key={String(p.permission_key)}
                title={String(p.permission_title)}
                summary={String(p.summary ?? "")}
                badge={`request ${p.can_request ? "✓" : "—"} · approve ${p.can_approve ? "✓" : "—"} · execute ${p.can_execute ? "✓" : "—"}`}
                extra={
                  Array.isArray(p.integrations_allowed) ? (
                    <p className="mt-1 text-xs text-zinc-500">Integrations: {(p.integrations_allowed as string[]).join(", ")}</p>
                  ) : null
                }
              />
            ))}
          </div>
          {(center.safety_rules ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.actionSafety}</h3>
              {(center.safety_rules ?? []).map((r) => (
                <ItemCard key={String(r.rule_key)} title={String(r.rule_title)} summary={String(r.summary ?? "")} badge={String(r.rule_type ?? "")} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "history" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {renderActions([...filterActionsByStatus(registry, "completed"), ...filterActionsByStatus(registry, "failed"), ...filterActionsByStatus(registry, "rejected")])}
          </div>
          {(center.audit_recent ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={entry.created_at ? <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p> : null}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.actionAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.templates ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.actionTemplates}</h3>
              {(center.templates ?? []).map((t) => (
                <ItemCard key={String(t.template_key)} title={String(t.template_title)} summary={String(t.summary ?? "")} badge={riskLabel(labels, t.risk_level)} />
              ))}
            </div>
          )}
          {(center.real_world ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.realWorldActions}</h3>
              {(center.real_world ?? []).map((r) => (
                <ItemCard key={String(r.action_key)} title={String(r.action_title)} summary={String(r.summary ?? "")} badge={String(r.framework_status ?? "")} />
              ))}
            </div>
          )}
          {center.mobile_access && (
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-amber-100">
                    {cap.replace(/_/g, " ")}: {enabled === true ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {activeSection === "overview" && registry.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.actionRegistry}</h3>
          {renderActions(registry.slice(0, 5))}
        </section>
      )}
    </div>
  );
}

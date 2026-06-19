"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import {
  chg605SectionToRpc,
  parseChangeOperationsCenter,
  type Chg605Section,
  type ChangeOperationsCenter,
} from "@/lib/change-operations-engine";
import type { buildChangeOperationsLabels } from "@/lib/change-operations-engine/labels";
import type { AipifyStatusKind } from "@/lib/design/status-system";

type Labels = ReturnType<typeof buildChangeOperationsLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function StatusBadge({ status, statusLabel }: { status: string; statusLabel: string }) {
  return <AipifyStatusBadge kind={mapChangeStatus(status)} label={`${statusLabel}: ${formatStatus(status)}`} />;
}

function ItemCard({
  title,
  summary,
  status,
  statusLabel,
}: {
  title: string;
  summary?: string;
  status?: string;
  statusLabel: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-gray-900">{title}</p>
        {status ? <StatusBadge status={status} statusLabel={statusLabel} /> : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-gray-600">{summary}</p> : null}
    </div>
  );
}

export function ChangeOperationsPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Chg605Section | "calendar" | "history" | "advisory";
}) {
  const [center, setCenter] = useState<ChangeOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = chg605SectionToRpc(activeSection);
    const res = await fetch(`/api/platform/change-operations/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseChangeOperationsCenter(await res.json()));
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

  const exec = center.executive_dashboard ?? {};
  const stats = center.stats ?? {};
  const sectionTitle =
    activeSection === "calendar" || activeSection === "history" || activeSection === "advisory"
      ? labels.sections[activeSection]
      : labels.sections[activeSection as Chg605Section];
  const sectionItems = getSectionItems(center, activeSection);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-gray-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports" || activeSection === "advisory") &&
        Object.keys(exec).length > 0 && (
          <section className="space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.executiveDashboard}</h3>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(exec).map(([key, value]) => (
                <StatCard key={key} label={key.replace(/_/g, " ")} value={value} />
              ))}
            </dl>
          </section>
        )}

      {Object.keys(stats).length > 0 && activeSection === "overview" && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stats).map(([key, value]) => (
            <StatCard key={key} label={key.replace(/_/g, " ")} value={value} />
          ))}
        </dl>
      )}

      {(center.companion_recommendations ?? []).length > 0 &&
        (activeSection === "overview" || activeSection === "advisory") && (
          <section className="space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.companionRecommendations}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {center.companion_recommendations!.map((item, idx) => (
                <ItemCard
                  key={String(item.key ?? idx)}
                  title={String(item.observation ?? "")}
                  summary={String(item.recommendation ?? "")}
                  status={String(item.key ?? "information")}
                  statusLabel={labels.status}
                />
              ))}
            </div>
          </section>
        )}

      {(center.advisory_insights ?? []).length > 0 && activeSection === "advisory" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.advisory}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {(center.advisory_insights ?? []).map((item, idx) => (
              <ItemCard
                key={String(item.insight_key ?? idx)}
                title={String(item.insight_title ?? "")}
                summary={String(item.recommendation ?? "")}
                status="active"
                statusLabel={labels.status}
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "calendar" && (
        <section className="space-y-4">
          {(center.calendar_events ?? []).length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(center.calendar_events ?? []).map((item, idx) => (
                <ItemCard
                  key={String(item.event_id ?? idx)}
                  title={String(item.event_title ?? "")}
                  summary={String(item.summary ?? "")}
                  status={String(item.event_type ?? "scheduled")}
                  statusLabel={labels.status}
                />
              ))}
            </div>
          )}
          {(center.freeze_periods ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">{labels.sections.calendar}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {(center.freeze_periods ?? []).map((item, idx) => (
                  <ItemCard
                    key={String(item.freeze_id ?? idx)}
                    title={String(item.freeze_title ?? "")}
                    summary={String(item.summary ?? "")}
                    status={String(item.freeze_status ?? "scheduled")}
                    statusLabel={labels.status}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activeSection === "history" && (center.platform_history ?? []).length > 0 && (
        <section className="space-y-3">
          <div className="grid gap-3">
            {(center.platform_history ?? []).map((item, idx) => (
              <ItemCard
                key={String(item.history_id ?? idx)}
                title={String(item.event_title ?? "")}
                summary={String(item.summary ?? "")}
                status={String(item.event_status ?? "recorded")}
                statusLabel={labels.status}
              />
            ))}
          </div>
        </section>
      )}

      {sectionItems.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.records}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {sectionItems.slice(0, 24).map((item, idx) => (
              <ItemCard
                key={String(item.id ?? idx)}
                title={item.title}
                summary={item.summary}
                status={item.badge}
                statusLabel={labels.status}
              />
            ))}
          </div>
        </section>
      )}

      {(center.rows ?? []).length > 0 && sectionItems.length === 0 && activeSection !== "calendar" && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.records}</th>
                <th className="px-4 py-3">{labels.status}</th>
              </tr>
            </thead>
            <tbody>
              {(center.rows ?? []).slice(0, 25).map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {String(row.title ?? row.customer_name ?? "—")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={String(row.status ?? "information")} statusLabel={labels.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "reports" && center.reports && Object.keys(center.reports).length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.reports}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(center.reports).map(([key, value]) => (
              <ItemCard key={key} title={key.replace(/_/g, " ")} summary={value} statusLabel={labels.status} />
            ))}
          </div>
        </section>
      )}

      {(center.audit_recent ?? []).length > 0 &&
        (activeSection === "overview" || activeSection === "reports") && (
          <section className="space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.auditRecent}</h3>
            <div className="space-y-2">
              {(center.audit_recent ?? []).slice(0, 10).map((entry, idx) => (
                <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  <StatusBadge
                    status={String(entry.event_type ?? "information")}
                    statusLabel={labels.status}
                  />
                  <span className="ml-2">{String(entry.summary ?? "")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      {sectionItems.length === 0 &&
        !(center.rows ?? []).length &&
        activeSection !== "overview" &&
        activeSection !== "reports" &&
        activeSection !== "advisory" &&
        activeSection !== "calendar" &&
        activeSection !== "history" && (
          <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            {labels.noRecords}
          </p>
        )}
    </div>
  );
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

function mapChangeStatus(status: string): AipifyStatusKind {
  const s = status.toLowerCase();
  if (["successfully_released", "approved", "passed", "complete", "recorded", "active", "linked", "not_required", "waived"].some((k) => s.includes(k))) {
    return "completed";
  }
  if (["failed", "rolled_back", "cancelled", "rejected", "blocked"].some((k) => s.includes(k))) {
    return "not_allowed";
  }
  if (["pending", "scheduled", "draft", "under_review", "approval_required", "testing", "preparing", "monitoring", "in_progress"].some((k) => s.includes(k))) {
    return "waiting";
  }
  if (["emergency", "critical", "high", "collision", "detected", "freeze"].some((k) => s.includes(k))) {
    return "needs_attention";
  }
  return "information";
}

function getSectionItems(
  center: ChangeOperationsCenter,
  section: Chg605Section | "calendar" | "history" | "advisory"
): Array<{ id: string; title: string; summary?: string; badge?: string }> {
  switch (section) {
    case "changeRequests":
      return [
        ...(center.changes ?? []).map((c) => ({
          id: String(c.change_id),
          title: String(c.change_title),
          summary: String(c.summary ?? ""),
          badge: String(c.change_status),
        })),
        ...(center.change_requests ?? []).map((r) => ({
          id: String(r.request_id),
          title: String(r.request_title),
          summary: String(r.summary ?? ""),
          badge: String(r.request_status),
        })),
      ];
    case "releases":
      return (center.releases ?? []).map((r) => ({
        id: String(r.release_id),
        title: String(r.release_title),
        summary: String(r.summary ?? ""),
        badge: String(r.release_status),
      }));
    case "deployments":
      return (center.deployments ?? []).map((d) => ({
        id: String(d.deployment_id),
        title: `${d.environment_key} — ${d.deployment_id}`,
        summary: String(d.summary ?? ""),
        badge: String(d.deployment_status),
      }));
    case "approvals":
      return (center.approvals ?? []).map((a) => ({
        id: String(a.approval_id),
        title: `${a.approver_role} — ${a.change_id}`,
        summary: String(a.summary ?? ""),
        badge: String(a.approval_status),
      }));
    case "environments":
      return (center.environments ?? []).map((e) => ({
        id: String(e.environment_key),
        title: String(e.environment_title),
        summary: String(e.summary ?? ""),
        badge: String(e.environment_status),
      }));
    case "featureFlags":
      return (center.feature_flags ?? []).map((f) => ({
        id: String(f.flag_key),
        title: String(f.flag_title),
        summary: String(f.summary ?? ""),
        badge: String(f.flag_status),
      }));
    case "databaseChanges":
      return (center.database_changes ?? []).map((d) => ({
        id: String(d.db_change_id),
        title: String(d.migration_ref || d.db_change_id),
        summary: String(d.summary ?? ""),
        badge: String(d.approval_status),
      }));
    case "emergencyChanges":
      return (center.emergency_changes ?? []).map((e) => ({
        id: String(e.emergency_id),
        title: String(e.change_id),
        summary: String(e.summary ?? ""),
        badge: String(e.emergency_status),
      }));
    case "rollback":
      return [
        ...(center.rollback_decisions ?? []).map((r) => ({
          id: String(r.decision_id),
          title: `Decision — ${r.change_id}`,
          summary: String(r.summary ?? ""),
          badge: String(r.decision_status),
        })),
        ...(center.rollback_procedures ?? []).map((p) => ({
          id: String(p.procedure_id),
          title: `Procedure — ${p.change_id}`,
          summary: String(p.summary ?? ""),
          badge: String(p.procedure_status),
        })),
        ...(center.forward_fix_options ?? []).map((o) => ({
          id: String(o.option_id),
          title: String(o.option_title),
          summary: String(o.summary ?? ""),
          badge: String(o.option_status),
        })),
      ];
    case "evidence":
      return (center.evidence_items ?? []).map((e) => ({
        id: String(e.evidence_id),
        title: String(e.evidence_type),
        summary: String(e.summary ?? ""),
        badge: String(e.evidence_status),
      }));
    default:
      return [];
  }
}

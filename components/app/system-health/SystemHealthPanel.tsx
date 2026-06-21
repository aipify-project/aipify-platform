"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import {
  parseReliabilityCenter,
  rel604CustomerSectionToRpc,
  mapReliabilityStatusToSemantic,
  type Rel604CustomerSection,
  type ReliabilityCenter,
} from "@/lib/reliability-operations-engine";
import {
  systemHealthStatusLabel,
  type buildSystemHealthLabels,
} from "@/lib/reliability-operations-engine/labels";

type Labels = ReturnType<typeof buildSystemHealthLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
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
  statusLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-gray-900">{title}</p>
        {status ? (
          (() => {
            const semantic = mapReliabilityStatusToSemantic(status);
            return (
              <SemanticBadge
                type={semantic.type}
                value={semantic.value}
                label={statusLabel ?? String(status).replace(/_/g, " ")}
              />
            );
          })()
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-gray-600">{summary}</p> : null}
    </div>
  );
}

export function SystemHealthPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Rel604CustomerSection;
}) {
  const [center, setCenter] = useState<ReliabilityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = rel604CustomerSectionToRpc(activeSection);
    const res = await fetch(`/api/system-health/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseReliabilityCenter(await res.json()));
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
  const sectionItems = getSectionItems(center, activeSection, labels);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections[activeSection]}</h2>
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

      {activeSection === "overview" && center.overall_health_score != null && (
        <StatCard label={labels.overallHealth} value={center.overall_health_score} />
      )}

      {Object.keys(stats).length > 0 && activeSection === "overview" && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value]) => (
            <StatCard key={key} label={key.replace(/_/g, " ")} value={value} />
          ))}
        </dl>
      )}

      {(center.companion_recommendations ?? []).length > 0 && activeSection === "overview" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.companionRecommendations}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.companion_recommendations!.map((item, idx) => (
              <ItemCard
                key={String(item.key ?? idx)}
                title={String(item.observation ?? "")}
                summary={String(item.recommendation ?? "")}
                status="operational"
                statusLabel={systemHealthStatusLabel(labels.status, "operational")}
              />
            ))}
          </div>
        </section>
      )}

      {sectionItems.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.records}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {sectionItems.slice(0, 24).map((item) => (
              <ItemCard key={item.id} title={item.title} summary={item.summary} status={item.status} statusLabel={item.statusLabel} />
            ))}
          </div>
        </section>
      )}

      {(center.rows ?? []).length > 0 && sectionItems.length === 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.records}</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(center.rows ?? []).slice(0, 25).map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{String(row.title ?? "—")}</td>
                  <td className="px-4 py-3">
                    {(() => {
                      const semantic = mapReliabilityStatusToSemantic(row.status);
                      return (
                        <SemanticBadge
                          type={semantic.type}
                          value={semantic.value}
                          label={systemHealthStatusLabel(labels.status, row.status)}
                        />
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(center.audit_recent ?? []).length > 0 && activeSection === "overview" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.auditRecent}</h3>
          <div className="space-y-2">
            {(center.audit_recent ?? []).slice(0, 10).map((entry, idx) => (
              <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="font-medium capitalize">{String(entry.event_type ?? "").replace(/_/g, " ")}</span>
                {" — "}
                {String(entry.summary ?? "")}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionItems.length === 0 && !(center.rows ?? []).length && activeSection !== "overview" && (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
          {labels.noRecords}
        </p>
      )}
    </div>
  );
}

function getSectionItems(
  center: ReliabilityCenter,
  section: Rel604CustomerSection,
  labels: Labels
): Array<{ id: string; title: string; summary?: string; status?: string; statusLabel?: string }> {
  const statusLbl = (s: unknown) => systemHealthStatusLabel(labels.status, s);

  switch (section) {
    case "connectedApps":
      return (center.connected_apps ?? []).map((a) => ({
        id: String(a.app_key),
        title: String(a.app_title),
        summary: String(a.summary ?? ""),
        status: String(a.connection_status),
        statusLabel: statusLbl(a.connection_status),
      }));
    case "businessPacks":
      return (center.business_packs ?? []).map((p) => ({
        id: String(p.pack_key),
        title: String(p.pack_title),
        summary: String(p.summary ?? ""),
        status: String(p.reliability_status),
        statusLabel: statusLbl(p.reliability_status),
      }));
    case "workflows":
      return (center.workflows ?? []).map((w) => ({
        id: String(w.workflow_key),
        title: String(w.workflow_title),
        summary: `${w.success_rate_pct}% success`,
        status: String(w.reliability_status),
        statusLabel: statusLbl(w.reliability_status),
      }));
    case "domains":
      return (center.domains ?? []).map((d) => ({
        id: String(d.domain_key),
        title: String(d.domain_name),
        summary: String(d.summary ?? ""),
        status: String(d.certificate_status),
        statusLabel: statusLbl(d.certificate_status),
      }));
    case "notifications":
      return (center.notifications ?? []).map((n) => ({
        id: String(n.notification_key),
        title: String(n.notification_title),
        summary: String(n.summary ?? ""),
        status: String(n.delivery_status),
        statusLabel: statusLbl(n.delivery_status),
      }));
    case "recentIncidents":
      return (center.incidents ?? []).map((i) => ({
        id: String(i.incident_key),
        title: String(i.incident_title),
        summary: String(i.summary ?? ""),
        status: String(i.severity),
        statusLabel: String(i.severity),
      }));
    case "maintenance":
      return (center.maintenance ?? []).map((m) => ({
        id: String(m.maintenance_key),
        title: String(m.maintenance_title),
        summary: String(m.summary ?? ""),
        status: String(m.maintenance_status),
        statusLabel: statusLbl(m.maintenance_status),
      }));
    case "support":
      return (center.support ?? []).map((s) => ({
        id: String(s.support_key),
        title: String(s.support_title),
        summary: String(s.summary ?? ""),
        status: String(s.support_status),
        statusLabel: statusLbl(s.support_status),
      }));
    default:
      return [];
  }
}

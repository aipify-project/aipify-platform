"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ORG_MEMORY_CORE_PRINCIPLE,
  ORG_MEMORY_PHILOSOPHY,
  ORG_MEMORY_VISION,
  parseOrganizationalMemoryCenter,
  type OrganizationalMemoryCenter,
} from "@/lib/organizational-memory-center";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  visionTitle: string;
  knowledgeCenterLink: string;
  orgMemoryEngineLink: string;
  enterpriseMemoryLink: string;
  employeeKnowledgeLink: string;
  dashboardTitle: string;
  recentKnowledgeTitle: string;
  knowledgeItemsTitle: string;
  gapsTitle: string;
  retentionRisksTitle: string;
  insightsTitle: string;
  contributionsTitle: string;
  validationTitle: string;
  emptySection: string;
  category: string;
  health: string;
  validation: string;
  usage: string;
  owner: string;
  dismiss: string;
  approve: string;
  markReviewed: string;
  submitContribution: string;
  contributionTitle: string;
  contributionContent: string;
  humansDecide: string;
  privacyNote: string;
  categories: Record<string, string>;
  healthLevels: Record<string, string>;
  validationStatuses: Record<string, string>;
  metrics: Record<string, string>;
};

type Props = { labels: PanelLabels };

const HEALTH_STYLES: Record<string, string> = {
  excellent: "bg-emerald-100 text-emerald-900",
  healthy: "bg-sky-100 text-sky-900",
  needs_attention: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

const VALIDATION_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  review: "bg-amber-100 text-amber-900",
  approved: "bg-indigo-100 text-indigo-900",
  published: "bg-emerald-100 text-emerald-800",
  periodic_review: "bg-violet-100 text-violet-900",
};

export function OrganizationalMemoryCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalMemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [contribTitle, setContribTitle] = useState("");
  const [contribContent, setContribContent] = useState("");
  const [contribCategory, setContribCategory] = useState("operational");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/organizational-memory/center");
    if (res.ok) setCenter(parseOrganizationalMemoryCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/organizational-memory/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.knowledge_center && (
          <Link href={center.links.knowledge_center} className="text-slate-600 hover:underline">
            {labels.knowledgeCenterLink}
          </Link>
        )}
        {center?.links?.organizational_memory_engine && (
          <Link href={center.links.organizational_memory_engine} className="text-slate-600 hover:underline">
            {labels.orgMemoryEngineLink}
          </Link>
        )}
        {center?.links?.enterprise_memory && (
          <Link href={center.links.enterprise_memory} className="text-slate-600 hover:underline">
            {labels.enterpriseMemoryLink}
          </Link>
        )}
        {center?.links?.employee_knowledge && (
          <Link href={center.links.employee_knowledge} className="text-slate-600 hover:underline">
            {labels.employeeKnowledgeLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {ORG_MEMORY_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.philosophyTitle}: {ORG_MEMORY_PHILOSOPHY}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.visionTitle}: {ORG_MEMORY_VISION}
        </p>
        <p className="mt-3 text-sm font-medium text-indigo-900">{labels.humansDecide}</p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.healthScore} value={`${dash.knowledge_health_score}%`} />
            <Metric label={labels.metrics.healthLabel} value={labels.healthLevels[dash.health_label] ?? dash.health_label} />
            <Metric label={labels.metrics.recentAdded} value={dash.recent_added_count} />
            <Metric label={labels.metrics.gapsOpen} value={dash.gaps_open_count} />
            <Metric label={labels.metrics.usageTotal} value={dash.usage_total} />
            <Metric label={labels.metrics.criticalRisks} value={dash.critical_risks_count} />
            <Metric label={labels.metrics.retentionRisks} value={dash.retention_risks_count} />
            <Metric label={labels.metrics.reuseRate} value={`${dash.reuse_rate}%`} />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recentKnowledgeTitle}</h2>
        {center?.recent_knowledge.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center?.recent_knowledge.map((item) => (
              <KnowledgeItemRow key={item.item_key} item={item} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.knowledgeItemsTitle}</h2>
        {center?.knowledge_items.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptySection}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center?.knowledge_items.map((item) => (
              <KnowledgeItemRow key={item.item_key} item={item} labels={labels} canManage={center?.can_manage ?? false} onAction={postAction} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.gapsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.knowledge_gaps.map((gap) => (
            <li key={gap.gap_key} className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-sm">
              <p className="text-gray-800">{gap.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_gap", gap_key: gap.gap_key })}>
                  {labels.dismiss}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.retentionRisksTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.retention_risks.map((risk) => (
            <li key={risk.risk_key} className="rounded-xl border border-rose-100 bg-rose-50/30 p-3 text-sm">
              <p className="text-gray-800">{risk.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_risk", risk_key: risk.risk_key })}>
                  {labels.dismiss}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.insightsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.insights.map((ins) => (
            <li key={ins.insight_key} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 text-sm">
              <p className="text-gray-800">{ins.message}</p>
              {center?.can_manage && (
                <button type="button" className="mt-2 text-xs text-slate-600 hover:underline" onClick={() => void postAction({ action: "dismiss_insight", insight_key: ins.insight_key })}>
                  {labels.dismiss}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.contributionsTitle}</h2>
        <ul className="mt-4 space-y-2">
          {center?.contributions.map((c) => (
            <li key={c.contribution_key} className="rounded-xl border border-gray-100 p-3 text-sm">
              <p className="font-medium text-gray-900">{c.title}</p>
              <p className="mt-1 text-gray-700">{c.content}</p>
              <p className="mt-2 text-xs text-gray-500">
                {c.contributor_label} · {labels.categories[c.category] ?? c.category} · {labels.validationStatuses[c.status] ?? c.status}
              </p>
              {center?.can_manage && c.status !== "approved" && (
                <ActionBtn label={labels.approve} className="mt-2" onClick={() => void postAction({ action: "approve_contribution", contribution_key: c.contribution_key })} />
              )}
            </li>
          ))}
        </ul>

        {center?.can_contribute && (
          <form
            className="mt-6 space-y-3 rounded-xl border border-dashed border-gray-200 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void postAction({
                action: "submit_contribution",
                title: contribTitle,
                content: contribContent,
                category: contribCategory,
              }).then(() => {
                setContribTitle("");
                setContribContent("");
              });
            }}
          >
            <input
              type="text"
              value={contribTitle}
              onChange={(e) => setContribTitle(e.target.value)}
              placeholder={labels.contributionTitle}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
            <textarea
              value={contribContent}
              onChange={(e) => setContribContent(e.target.value)}
              placeholder={labels.contributionContent}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              rows={3}
              required
            />
            <select value={contribCategory} onChange={(e) => setContribCategory(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
              {Object.entries(labels.categories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-lg border border-indigo-200 bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
              {labels.submitContribution}
            </button>
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.validationTitle}</h2>
        <ol className="mt-4 flex flex-wrap gap-2 text-sm">
          {(["draft", "review", "approved", "published", "periodic_review"] as const).map((stage, i) => (
            <li key={stage} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${VALIDATION_STYLES[stage]}`}>
                {labels.validationStatuses[stage]}
              </span>
              {i < 4 && <span className="text-gray-400">→</span>}
            </li>
          ))}
        </ol>
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function KnowledgeItemRow({
  item,
  labels,
  canManage,
  onAction,
}: {
  item: OrganizationalMemoryCenter["knowledge_items"][number];
  labels: PanelLabels;
  canManage: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <li className="rounded-xl border border-gray-100 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-semibold text-gray-900">{item.title}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${HEALTH_STYLES[item.health_level] ?? HEALTH_STYLES.healthy}`}>
          {labels.healthLevels[item.health_level] ?? item.health_level}
        </span>
      </div>
      <p className="mt-2 text-gray-700">{item.summary}</p>
      <p className="mt-2 text-xs text-gray-500">
        {labels.category}: {labels.categories[item.category] ?? item.category} · {labels.validation}: {labels.validationStatuses[item.validation_status] ?? item.validation_status} · {labels.usage}: {item.usage_count}
        {item.owner_label ? ` · ${labels.owner}: ${item.owner_label}` : ""}
      </p>
      {canManage && (
        <ActionBtn label={labels.markReviewed} variant="muted" className="mt-3" onClick={() => void onAction({ action: "mark_reviewed", item_key: item.item_key })} />
      )}
    </li>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
  className = "",
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "muted";
  className?: string;
}) {
  const styles =
    variant === "muted"
      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${styles} ${className}`}>
      {label}
    </button>
  );
}

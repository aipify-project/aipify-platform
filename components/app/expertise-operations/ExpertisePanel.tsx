"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  AVAILABILITY_BADGES,
  CONFIDENCE_BADGES,
  EXPERTISE_TABS,
  OWNERSHIP_STATUS_BADGES,
  PROFILE_TYPE_BADGES,
  RISK_LEVEL_BADGES,
  parseExpertiseCenter,
  type ExpertiseCenter,
  type ExpertiseLabels,
  type ExpertiseTab,
} from "@/lib/customer-expertise-operations";

type Props = {
  labels: ExpertiseLabels;
  backHref: string;
  initialTab?: ExpertiseTab;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemList({ items, variant = "default" }: { items: Record<string, unknown>[]; variant?: "default" | "expert" | "asset" }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={String(item.profile_key ?? item.asset_key ?? item.map_key ?? item.project_key ?? item.recommendation_key ?? item.risk_key ?? item.department_key ?? item.pack_key ?? item.mentorship_key ?? i)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.profile_name ?? item.asset_title ?? item.map_title ?? item.project_title
                ?? item.recommendation_title ?? item.risk_title ?? item.department_title
                ?? item.pack_title ?? item.mentor_name ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          {item.recommended_expert ? (
            <p className="mt-1 text-indigo-700">{String(item.recommended_expert)}</p>
          ) : null}
          {item.owner_name ? (
            <p className="mt-1 text-zinc-600">
              {String(item.owner_name)}
              {item.backup_owner_name ? ` · ${String(item.backup_owner_name)}` : ""}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.profile_type ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PROFILE_TYPE_BADGES[String(item.profile_type)] ?? PROFILE_TYPE_BADGES.employee}`}>
                {String(item.profile_type)}
              </span>
            ) : null}
            {item.availability ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${AVAILABILITY_BADGES[String(item.availability)] ?? AVAILABILITY_BADGES.available}`}>
                {String(item.availability)}
              </span>
            ) : null}
            {item.ownership_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${OWNERSHIP_STATUS_BADGES[String(item.ownership_status)] ?? OWNERSHIP_STATUS_BADGES.owned}`}>
                {String(item.ownership_status)}
              </span>
            ) : null}
            {item.risk_level ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${RISK_LEVEL_BADGES[String(item.risk_level)] ?? RISK_LEVEL_BADGES.moderate}`}>
                {String(item.risk_level)}
              </span>
            ) : null}
            {item.confidence ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CONFIDENCE_BADGES[String(item.confidence)] ?? CONFIDENCE_BADGES.moderate}`}>
                {String(item.confidence)}
              </span>
            ) : null}
            {item.coverage_score != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.coverage_score)}%</span>
            ) : null}
            {item.concentration_pct != null ? (
              <span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700">{String(item.concentration_pct)}%</span>
            ) : null}
            {item.department ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.department)}</span>
            ) : null}
            {variant === "expert" && Array.isArray(item.expertise_areas) ? (
              (item.expertise_areas as string[]).slice(0, 3).map((area) => (
                <span key={area} className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700">{area}</span>
              ))
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExpertisePanel({ labels, backHref, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<ExpertiseCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ExpertiseTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/expertise-operations");
    if (res.ok) setCenter(parseExpertiseCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/expertise-operations/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion ?? {};
  const knowWhoPrompts = (companion.know_who_prompts as string[]) ?? [];
  const advisorPrompts = (companion.expertise_advisor_prompts as string[]) ?? [];
  const execRecommendations = (executive.companion_recommendations as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_expertise")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshExpertise}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_expertise_report")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateExpertiseReport}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXPERTISE_TABS.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-8">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label={labels.overview.expertCount} value={Number(overview.expert_count ?? 0)} />
            <OverviewCard label={labels.overview.knowledgeAssets} value={Number(overview.knowledge_assets ?? 0)} />
            <OverviewCard label={labels.overview.ownedAssets} value={Number(overview.owned_assets ?? 0)} />
            <OverviewCard label={labels.overview.unownedAssets} value={Number(overview.unowned_assets ?? 0)} />
            <OverviewCard label={labels.overview.criticalRisks} value={Number(overview.critical_risks ?? 0)} />
            <OverviewCard label={labels.overview.successionRisks} value={Number(overview.succession_risks ?? 0)} />
            <OverviewCard label={labels.overview.activeMentorships} value={Number(overview.active_mentorships ?? 0)} />
            <OverviewCard label={labels.overview.departmentCoverage} value={`${Number(overview.department_coverage ?? 0)}%`} />
            <OverviewCard label={labels.overview.companionRecommendations} value={Number(overview.companion_recommendations ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.executiveDashboard}</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard label={labels.sections.criticalKnowledgeMap} value={Number(executive.knowledge_risks ?? 0)} />
              <OverviewCard label={labels.overview.departmentCoverage} value={`${Number(executive.expertise_coverage ?? 0)}%`} />
              <OverviewCard label={labels.overview.activeMentorships} value={Number(executive.mentorship_activity ?? 0)} />
              <OverviewCard label={labels.overview.unownedAssets} value={Number(executive.knowledge_ownership_gaps ?? 0)} />
              <OverviewCard label={labels.sections.successionRisks} value={Number(executive.succession_risks ?? 0)} />
            </dl>
            <div className="mt-4"><ItemList items={execRecommendations} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.criticalKnowledgeMap}</h2>
            <div className="mt-4"><ItemList items={center.critical_knowledge_map ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.recommendations}</h2>
            <div className="mt-4"><ItemList items={center.recommendations ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "expert_directory" ? (
        <section><ItemList items={center.expert_directory ?? []} variant="expert" /></section>
      ) : null}

      {tab === "knowledge_owners" ? (
        <section className="space-y-4">
          <ItemList items={center.knowledge_owners ?? []} variant="asset" />
          {(center.knowledge_owners ?? []).filter((a) => a.ownership_status === "unowned").map((asset) => (
            <button key={String(asset.asset_key)} type="button" disabled={busy}
              onClick={() => void runAction("assign_knowledge_owner", { asset_key: asset.asset_key, owner_name: "Pending assignment" })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
              {labels.actions.assignKnowledgeOwner}
            </button>
          ))}
        </section>
      ) : null}

      {tab === "departments" ? (
        <section className="space-y-6">
          <ItemList items={center.departments ?? []} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.businessPacks}</h2>
            <div className="mt-4"><ItemList items={center.business_packs ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "skills" ? (
        <section>
          <div className="flex flex-wrap gap-2">
            {(center.skills ?? []).map((skill) => (
              <span key={skill} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{skill}</span>
            ))}
          </div>
        </section>
      ) : null}

      {tab === "projects" ? (
        <section><ItemList items={center.projects ?? []} /></section>
      ) : null}

      {tab === "mentors" ? (
        <section className="space-y-6">
          <ItemList items={center.mentorship ?? []} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.successionRisks}</h2>
            <div className="mt-4"><ItemList items={center.succession_risks ?? []} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.companionAdvisor}</h2>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              {knowWhoPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
              {advisorPrompts.map((prompt) => <li key={prompt}>· {prompt}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              {(center.audit_recent ?? []).map((entry, i) => (
                <li key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                  <span className="font-medium text-zinc-900">{entry.event_type}</span>
                  {entry.summary ? ` — ${entry.summary}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

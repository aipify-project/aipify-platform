"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  SKILL_HEALTH_BADGES,
  SKILL_STATUS_BADGES,
  parseCompanionSkillsCenter,
  type CompanionSkillsCenter,
  type CompanionSkillsLabels,
  type CompanionSkillsTab,
  type SkillRow,
} from "@/lib/customer-companion-skills-operations";

type Props = {
  labels: CompanionSkillsLabels;
  backHref: string;
  initialTab?: CompanionSkillsTab;
  visibleTabs?: CompanionSkillsTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

const ALL_TABS: CompanionSkillsTab[] = [
  "overview", "installed", "marketplace", "specialists", "knowledge",
  "permissions", "training", "companion", "executive", "reports",
];

export function CompanionSkillsPanel({
  labels, backHref, initialTab = "overview", visibleTabs, titleOverride, subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<CompanionSkillsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionSkillsTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-skills-operations");
    if (res.ok) setCenter(parseCompanionSkillsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/companion-skills-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, payload }),
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
  const installed = center.skill_registry ?? [];
  const marketplace = center.skill_marketplace ?? [];
  const specialists = center.specialist_framework ?? [];
  const knowledge = center.knowledge_source_governance ?? [];
  const training = center.training_engine ?? [];
  const profiles = center.capability_profiles ?? [];
  const bundles = center.capability_bundles ?? [];
  const packSkills = center.business_pack_integration ?? [];
  const health = center.skill_health_monitoring ?? [];
  const advisorPrompts = (center.companion_skill_advisor?.advisor_prompts as string[]) ?? [];
  const allowedActions = (center.skill_permissions?.allowed_actions as string[]) ?? [];
  const installSteps = (center.installation_workflow?.steps as string[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.governance_note ? (
          <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.governanceNote}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/companion/skills/marketplace" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{labels.actions.openMarketplace}</Link>
        <Link href="/app/companion/skills/training" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openTraining}</Link>
        <Link href="/app/companion-marketplace" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openLegacyMarketplace}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.installedSkills} value={overview.installed_skills ?? 0} />
          <OverviewCard label={labels.overview.activeSkills} value={overview.active_skills ?? 0} />
          <OverviewCard label={labels.overview.marketplaceAvailable} value={overview.marketplace_available ?? 0} />
          <OverviewCard label={labels.overview.specialists} value={overview.specialists ?? 0} />
          <OverviewCard label={labels.overview.knowledgeSources} value={overview.knowledge_sources ?? 0} />
          <OverviewCard label={labels.overview.trainingInProgress} value={overview.training_in_progress ?? 0} />
          <OverviewCard label={labels.overview.capabilityBundles} value={overview.capability_bundles ?? 0} />
          <OverviewCard label={labels.overview.skillsNeedingAttention} value={overview.skills_needing_attention ?? 0} />
        </dl>
      ) : null}

      {tab === "installed" ? (
        <section className="space-y-4">
          {installed.map((s: SkillRow) => (
            <div key={s.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{s.skill_name}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${SKILL_STATUS_BADGES[s.status ?? "active"] ?? SKILL_STATUS_BADGES.active}`}>
                  {labels.skillStatuses[s.status ?? "active"] ?? s.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{s.skill_id_label} · {s.category} · v{s.version_label}</p>
              <p className="mt-1 text-sm text-zinc-600">{s.description}</p>
              {s.status === "installing" ? (
                <button type="button" disabled={busy} onClick={() => void runAction("activate_skill", { skill_key: s.skill_key })} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.activateSkill}</button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "marketplace" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
            <p className="font-medium text-zinc-900">Installation workflow</p>
            <p className="mt-1 text-zinc-600">{installSteps.join(" → ")}</p>
          </div>
          {marketplace.map((m) => (
            <div key={String(m.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(m.skill_name)} · {String(m.category)}</p>
              <p className="text-zinc-500">{String(m.install_status)} · {String(m.summary)}</p>
              <p className="mt-1 text-zinc-600">{String(m.description)}</p>
              {String(m.install_status) === "available" ? (
                <button type="button" disabled={busy} onClick={() => void runAction("install_skill", { marketplace_key: m.marketplace_key })} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.installSkill}</button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "specialists" ? (
        <section className="space-y-4">
          {specialists.map((s) => (
            <div key={String(s.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(s.specialist_name)} · {String(s.specialist_type)}</p>
              <p className="text-zinc-500">Skills: {JSON.stringify(s.composed_skills)} · Usage {String(s.usage_count)}</p>
              <p className="mt-1 text-zinc-600">{String(s.capability_summary)}</p>
            </div>
          ))}
          {profiles.map((p) => (
            <div key={String(p.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              Profile: {String(p.profile_name)} — {JSON.stringify(p.capabilities)}
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("create_specialist", { specialist_name: "Knowledge Companion", specialist_type: "knowledge" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.createSpecialist}</button>
        </section>
      ) : null}

      {tab === "knowledge" ? (
        <section className="space-y-3">
          {knowledge.map((k) => (
            <div key={String(k.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(k.source_label)} · {String(k.source_type)}</p>
              <p className="text-zinc-500">Governed: {String(k.governed)} · Linked: {JSON.stringify(k.linked_skills)}</p>
              <p className="mt-1 text-zinc-600">{String(k.summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "permissions" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
            <h2 className="font-semibold text-zinc-900">Skill Permissions</h2>
            <p className="mt-2 text-zinc-600">Allowed actions: {allowedActions.join(", ")}</p>
            <p className="text-zinc-600">Explicit permissions required. Skills must never bypass governance.</p>
          </div>
          {installed.map((s: SkillRow) => (
            <div key={`perm-${s.id}`} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {s.skill_name} — {JSON.stringify(s.permissions)}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "training" ? (
        <section className="space-y-4">
          {training.map((t) => (
            <div key={String(t.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(t.skill_label)} · {String(t.source_label)}</p>
              <p className="text-zinc-500">{String(t.training_source)} · {String(t.progress_pct)}% · {String(t.status)}</p>
              <p className="mt-1 text-zinc-600">{String(t.summary)}</p>
            </div>
          ))}
          <button type="button" disabled={busy} onClick={() => void runAction("complete_training", { training_key: "tr_exec_brief" })} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50">{labels.actions.completeTraining}</button>
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <h2 className="font-semibold text-zinc-900">Companion Skill Advisor</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {advisorPrompts.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          {health.map((h) => (
            <div key={String(h.skill_key)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{String(h.skill_label)} · Score {String(h.performance_score)}</p>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${SKILL_HEALTH_BADGES[String(h.health_status)] ?? SKILL_HEALTH_BADGES.healthy}`}>
                  {labels.healthStatuses[String(h.health_status)] ?? String(h.health_status)}
                </span>
              </div>
              <p className="text-zinc-500">Usage {String(h.usage_score)} · Accuracy {String(h.accuracy_score)} · Value {String(h.business_value_score)}</p>
              <p className="mt-1 text-zinc-600">{String(h.summary)}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
              <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
            ))}
          </dl>
          {bundles.map((b) => (
            <div key={String(b.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
              <p className="font-medium text-zinc-900">{String(b.bundle_name)} · {String(b.install_status)}</p>
              <p className="text-zinc-600">{String(b.summary)}</p>
              {String(b.install_status) !== "installed" ? (
                <button type="button" disabled={busy} onClick={() => void runAction("install_bundle", { bundle_key: b.bundle_key })} className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.installBundle}</button>
              ) : null}
            </div>
          ))}
          {packSkills.map((p) => (
            <div key={String(p.id)} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
              {String(p.pack_label)} — Skills: {JSON.stringify(p.provided_skills)}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-zinc-600">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => <li key={`${entry.event_type}-${i}`}>{entry.summary}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

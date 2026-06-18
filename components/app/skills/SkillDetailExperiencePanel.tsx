"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSkillDetail, type SkillDetail } from "@/lib/aipify/skills";
import type { SkillsMarketplaceLabels } from "@/lib/skills-marketplace";

type SkillDetailExperiencePanelProps = {
  skillKey: string;
  labels: SkillsMarketplaceLabels;
  skillsBasePath?: string;
};

type DetailTab =
  | "overview"
  | "capabilities"
  | "permissions"
  | "audit"
  | "performance"
  | "deployment"
  | "faq"
  | "controls";

const TABS: DetailTab[] = [
  "overview",
  "capabilities",
  "permissions",
  "audit",
  "performance",
  "deployment",
  "faq",
  "controls",
];

export function SkillDetailExperiencePanel({
  skillKey,
  labels,
  skillsBasePath = "/app/skills",
}: SkillDetailExperiencePanelProps) {
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [tab, setTab] = useState<DetailTab>("overview");
  const [auditEvents, setAuditEvents] = useState<
    Array<{ id: string; action: string; result: string; created_at: string }>
  >([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/skills/${skillKey}`);
    if (res.ok) setSkill(parseSkillDetail(await res.json()));
    setLoading(false);
  }, [skillKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!skill?.tenant_skill_id) return;
    void fetch("/api/aipify/skills/history?limit=50")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) return;
        setAuditEvents(
          data
            .filter((event: { skill_key?: string }) => event.skill_key === skillKey)
            .slice(0, 8)
            .map((event: { id: string; event_type: string; created_at: string }) => ({
              id: event.id,
              action: event.event_type,
              result: "success",
              created_at: event.created_at,
            }))
        );
      })
      .catch(() => undefined);
  }, [skill?.tenant_skill_id, skillKey]);

  async function install(approve: boolean) {
    setActing(true);
    await fetch("/api/aipify/skills/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_key: skillKey, approve }),
    });
    await load();
    setActing(false);
  }

  async function disable() {
    if (!skill?.tenant_skill_id) return;
    setActing(true);
    await fetch(`/api/aipify/skills/${skillKey}/disable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_skill_id: skill.tenant_skill_id }),
    });
    await load();
    setActing(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!skill) return <div className="p-8 text-sm text-gray-600">{labels.detail.notFound}</div>;

  const depsOk = skill.dependency_check.satisfied;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <Link href={skillsBasePath} className="text-sm font-medium text-violet-700 hover:underline">
        {labels.detail.back}
      </Link>

      <header className="rounded-2xl border border-gray-200 bg-gradient-to-br from-violet-50/50 to-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-700">{skill.category}</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">{skill.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{skill.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
          <span>v{skill.version}</span>
          <span>·</span>
          <span>{skill.author}</span>
          {skill.installed ? (
            <>
              <span>·</span>
              <span className="font-medium text-emerald-700">{labels.activation.active}</span>
            </>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {!skill.installed && skill.plan_allowed && depsOk ? (
            <button
              type="button"
              disabled={acting}
              onClick={() => void install(skill.requires_approval)}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {skill.requires_approval ? labels.detail.installWithApproval : labels.detail.install}
            </button>
          ) : null}
          {skill.installed && skill.tenant_skill_id ? (
            <button
              type="button"
              disabled={acting}
              onClick={() => void disable()}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700"
            >
              {labels.detail.disable}
            </button>
          ) : null}
          {skill.knowledge_center_category ? (
            <Link
              href="/app/knowledge-center-engine"
              className="rounded-xl border border-violet-200 px-4 py-2 text-sm text-violet-700"
            >
              {labels.actions.learnMore}
            </Link>
          ) : null}
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
              tab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {labels.detail[key]}
          </button>
        ))}
      </nav>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
        {tab === "overview" ? (
          <div className="space-y-4">
            <p>{skill.description}</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-gray-500">{labels.installed.version}</dt>
                <dd>{skill.version}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">{labels.governance.riskLevel}</dt>
                <dd className="capitalize">{skill.risk_level}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {tab === "capabilities" ? (
          <ul className="list-disc space-y-2 pl-5">
            <li>{skill.description}</li>
            {skill.module_key ? <li>Module: {skill.module_key}</li> : null}
          </ul>
        ) : null}

        {tab === "permissions" ? (
          <ul className="list-disc pl-5">
            {skill.required_permissions.length === 0 ? (
              <li>{labels.detail.noPermissions}</li>
            ) : (
              skill.required_permissions.map((p) => <li key={p}>{p}</li>)
            )}
          </ul>
        ) : null}

        {tab === "audit" ? (
          auditEvents.length === 0 ? (
            <p className="text-gray-500">{labels.detail.noAudit}</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {auditEvents.map((event) => (
                <li key={event.id} className="py-2 text-xs">
                  <span className="font-medium">{event.action}</span>
                  <span className="text-gray-500"> · {event.result}</span>
                  <span className="block text-gray-400">{event.created_at}</span>
                </li>
              ))}
            </ul>
          )
        ) : null}

        {tab === "performance" ? (
          <p className="text-gray-500">
            {skill.installed
              ? labels.performance.successRate
              : labels.performance.empty}
          </p>
        ) : null}

        {tab === "deployment" ? (
          <ul className="space-y-2">
            {skill.dependencies.map((d) => (
              <li key={d.key}>
                {d.name} ({d.key}){d.required ? " · required" : ""}
              </li>
            ))}
            {!depsOk ? (
              <li className="text-amber-700">
                Missing: {skill.dependency_check.missing.map((m) => m.name).join(", ")}
              </li>
            ) : null}
          </ul>
        ) : null}

        {tab === "faq" ? (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">{labels.recommended.why}</p>
              <p className="mt-1 text-gray-600">{skill.description}</p>
            </div>
            {skill.knowledge_center_category ? (
              <Link href="/app/knowledge-center-engine" className="text-violet-700">
                {labels.actions.learnMore}
              </Link>
            ) : null}
          </div>
        ) : null}

        {tab === "controls" ? (
          <div className="space-y-3">
            <p>{labels.detail.controls}</p>
            {skill.permissions.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {skill.permissions.map((perm) => (
                  <li key={perm.permission_key} className="flex justify-between py-2 text-xs">
                    <span>{perm.permission_key}</span>
                    <span>{perm.approved ? "Approved" : "Pending"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{labels.detail.noPermissions}</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

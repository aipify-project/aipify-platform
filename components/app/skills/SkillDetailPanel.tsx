"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSkillDetail, type SkillDetail } from "@/lib/aipify/skills";

type SkillDetailPanelProps = {
  skillKey: string;
  labels: Record<string, string>;
};

export function SkillDetailPanel({ skillKey, labels }: SkillDetailPanelProps) {
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/skills/${skillKey}`);
    if (res.ok) setSkill(parseSkillDetail(await res.json()));
    setLoading(false);
  }, [skillKey]);

  useEffect(() => {
    void load();
  }, [load]);

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

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!skill) return <div className="p-6 text-sm text-gray-600">{labels.notFound}</div>;

  const depsOk = skill.dependency_check.satisfied;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Link href="/app/skills" className="text-sm text-violet-700">{labels.back}</Link>

      <div>
        <h1 className="text-2xl font-semibold">{skill.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {skill.category} · v{skill.version} · {skill.author} · {skill.risk_level} {labels.risk}
        </p>
        <p className="mt-4 text-gray-700">{skill.description}</p>
      </div>

      <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <h2 className="font-semibold">{labels.permissions}</h2>
        <ul className="mt-2 list-disc pl-5 text-gray-600">
          {skill.required_permissions.length === 0 ? (
            <li>{labels.noPermissions}</li>
          ) : (
            skill.required_permissions.map((p) => <li key={p}>{p}</li>)
          )}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
        <h2 className="font-semibold">{labels.dependencies}</h2>
        {skill.dependencies.length === 0 ? (
          <p className="mt-2 text-gray-500">{labels.noDependencies}</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {skill.dependencies.map((d) => (
              <li key={d.key} className="text-gray-700">
                {d.name} ({d.key}){d.required ? ` · ${labels.required}` : ""}
              </li>
            ))}
          </ul>
        )}
        {!depsOk ? (
          <p className="mt-2 text-amber-700">
            {labels.missingDeps}: {skill.dependency_check.missing.map((m) => m.name).join(", ")}
          </p>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        {!skill.installed && skill.plan_allowed && depsOk ? (
          <button
            type="button"
            disabled={acting}
            onClick={() => void install(skill.requires_approval)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {skill.requires_approval ? labels.installWithApproval : labels.install}
          </button>
        ) : null}
        {skill.installed && skill.tenant_skill_id ? (
          <button
            type="button"
            disabled={acting}
            onClick={() => void disable()}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700"
          >
            {labels.disable}
          </button>
        ) : null}
        {skill.knowledge_center_category ? (
          <Link
            href="/app/knowledge-center"
            className="rounded-lg border border-violet-200 px-4 py-2 text-sm text-violet-700"
          >
            {labels.learnMore}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

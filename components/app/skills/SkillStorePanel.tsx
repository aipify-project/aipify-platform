"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSkillCatalog, type SkillCatalogItem } from "@/lib/aipify/skills";

type SkillStorePanelProps = {
  labels: Record<string, string>;
  mode?: "catalog" | "installed";
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export function SkillStorePanel({ labels, mode = "catalog" }: SkillStorePanelProps) {
  const [skills, setSkills] = useState<SkillCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const url = category
      ? `/api/aipify/skills/catalog?category=${encodeURIComponent(category)}`
      : "/api/aipify/skills/catalog";
    const res = await fetch(url);
    if (res.ok) {
      let items = parseSkillCatalog(await res.json());
      if (mode === "installed") items = items.filter((s) => s.installed);
      else items = items.filter((s) => !s.installed);
      setSkills(items);
    }
    setLoading(false);
  }, [category, mode]);

  useEffect(() => {
    void load();
  }, [load]);

  async function install(key: string, approve = false) {
    setInstalling(key);
    await fetch("/api/aipify/skills/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_key: key, approve }),
    });
    await load();
    setInstalling(null);
  }

  const categories = [...new Set(skills.map((s) => s.category))].sort();

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === "installed" ? labels.installedTitle : labels.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/skills" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.catalog}
          </Link>
          <Link href="/app/skills/installed" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.installed}
          </Link>
          <Link href="/app/skills/history" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.history}
          </Link>
        </div>
      </div>

      {mode === "catalog" && categories.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1 text-xs ${!category ? "bg-violet-600 text-white" : "bg-gray-100"}`}
          >
            {labels.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs ${category === cat ? "bg-violet-600 text-white" : "bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      {skills.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {skills.map((skill) => (
            <li key={skill.key} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/app/skills/${skill.key}`} className="font-medium text-gray-900 hover:text-violet-700">
                    {skill.name}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">{skill.category} · v{skill.version}</p>
                </div>
                <span className={`rounded px-2 py-0.5 text-xs ${RISK_COLOR[skill.risk_level] ?? "bg-gray-100"}`}>
                  {skill.risk_level}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{skill.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!skill.plan_allowed ? (
                  <span className="text-xs text-amber-700">{labels.planRequired}</span>
                ) : skill.installed ? (
                  <span className="text-xs text-green-700">{labels.installedBadge}</span>
                ) : (
                  <button
                    type="button"
                    disabled={installing === skill.key}
                    onClick={() => void install(skill.key, skill.requires_approval)}
                    className="rounded bg-gray-900 px-3 py-1 text-xs text-white disabled:opacity-50"
                  >
                    {skill.requires_approval ? labels.installWithApproval : labels.install}
                  </button>
                )}
                <Link href={`/app/skills/${skill.key}`} className="text-xs text-violet-700">
                  {labels.review}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}

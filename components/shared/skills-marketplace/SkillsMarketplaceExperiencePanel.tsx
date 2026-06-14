"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  parseSkillsMarketplaceExperience,
  type SkillsMarketplaceActivationMethod,
  type SkillsMarketplaceCatalogItem,
  type SkillsMarketplaceDisplayStatus,
  type SkillsMarketplaceExperience,
  type SkillsMarketplaceLabels,
  type SkillsMarketplaceScope,
} from "@/lib/skills-marketplace";

type SkillsMarketplaceExperiencePanelProps = {
  scope: SkillsMarketplaceScope;
  labels: SkillsMarketplaceLabels;
  skillsBasePath: string;
  showGovernance?: boolean;
};

const STATUS_STYLE: Record<SkillsMarketplaceDisplayStatus, string> = {
  operational: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pilot: "bg-sky-50 text-sky-800 ring-sky-200",
  beta: "bg-violet-50 text-violet-800 ring-violet-200",
  paused: "bg-gray-100 text-gray-700 ring-gray-200",
  requires_attention: "bg-amber-50 text-amber-900 ring-amber-200",
};

const CATEGORY_ACCENT: Record<string, string> = {
  executive: "from-indigo-500/10 to-violet-500/5",
  support: "from-sky-500/10 to-cyan-500/5",
  commerce: "from-emerald-500/10 to-teal-500/5",
  operations: "from-slate-500/10 to-gray-500/5",
  knowledge: "from-amber-500/10 to-orange-500/5",
  growth: "from-rose-500/10 to-pink-500/5",
  compliance: "from-red-500/10 to-orange-500/5",
  automation: "from-violet-500/10 to-purple-500/5",
  companion: "from-fuchsia-500/10 to-violet-500/5",
};

function activationLabel(method: SkillsMarketplaceActivationMethod, labels: SkillsMarketplaceLabels): string {
  return labels.activation[method] ?? labels.actions.activate;
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
      {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm shadow-gray-900/5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-gray-900">{value}</p>
    </div>
  );
}

export function SkillsMarketplaceExperiencePanel({
  scope,
  labels,
  skillsBasePath,
  showGovernance = true,
}: SkillsMarketplaceExperiencePanelProps) {
  const [experience, setExperience] = useState<SkillsMarketplaceExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/skills-marketplace?scope=${scope}`);
    if (res.ok) {
      setExperience(parseSkillsMarketplaceExperience(await res.json()));
    }
    setLoading(false);
  }, [scope]);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(() => {
    if (!experience) return [];
    return [...new Set(experience.marketplace.map((item) => item.category))].sort();
  }, [experience]);

  const filteredMarketplace = useMemo(() => {
    if (!experience) return [];
    if (!categoryFilter) return experience.marketplace;
    return experience.marketplace.filter((item) => item.category === categoryFilter);
  }, [experience, categoryFilter]);

  async function activateSkill(key: string, requiresApproval: boolean) {
    if (scope !== "customer") return;
    setInstalling(key);
    await fetch("/api/aipify/skills/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_key: key, approve: requiresApproval }),
    });
    await load();
    setInstalling(null);
  }

  if (loading) {
    return <div className="p-8 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!experience) {
    return <div className="p-8 text-sm text-gray-600">{labels.empty}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{labels.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {scope === "customer" ? (
              <>
                <Link
                  href={`${skillsBasePath}/history`}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:border-violet-200"
                >
                  {labels.actions.history}
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <p className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/80 to-indigo-50/40 px-4 py-3 text-sm text-violet-950">
          {experience.principle ?? labels.principle}
        </p>
      </header>

      {/* Section 1 — Overview */}
      <section aria-labelledby="skills-overview">
        <SectionHeading title={labels.sections.overview} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={labels.overview.installed} value={experience.overview.installed_count} />
          <StatCard label={labels.overview.available} value={experience.overview.available_count} />
          <StatCard label={labels.overview.pilot} value={experience.overview.pilot_count} />
          <StatCard label={labels.overview.pendingReviews} value={experience.overview.pending_reviews} />
        </div>
      </section>

      {/* Section 2 — Installed Skills */}
      <section aria-labelledby="skills-installed">
        <SectionHeading title={labels.sections.installed} />
        {experience.installed_skills.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.installed.empty}</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {experience.installed_skills.map((skill) => (
              <li
                key={skill.key}
                className={`overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br ${CATEGORY_ACCENT[skill.category] ?? CATEGORY_ACCENT.operations} bg-white p-5 shadow-sm shadow-gray-900/5 transition hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`${skillsBasePath}/${skill.key}`}
                      className="text-base font-semibold text-gray-900 hover:text-violet-700"
                    >
                      {skill.name}
                    </Link>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                      {labels.categories[skill.category]}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${STATUS_STYLE[skill.display_status]}`}
                  >
                    {labels.status[skill.display_status]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-2">{skill.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <dt className="font-medium text-gray-500">{labels.installed.version}</dt>
                    <dd>{skill.version}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">{labels.installed.environment}</dt>
                    <dd>
                      {skill.environment === "testing"
                        ? labels.environment.testing
                        : labels.environment.production}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-500">{labels.installed.owner}</dt>
                    <dd>{skill.owner}</dd>
                  </div>
                </dl>
                {scope === "platform" && skill.install_count != null ? (
                  <p className="mt-3 text-xs text-gray-500">
                    {skill.install_count} tenant installs
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section 3 — Recommended Skills */}
      <section aria-labelledby="skills-recommended">
        <SectionHeading title={labels.sections.recommended} />
        {experience.recommended_skills.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.recommended.empty}</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {experience.recommended_skills.map((skill) => (
              <li
                key={skill.key}
                className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <p className="mt-0.5 text-xs text-indigo-700">{labels.categories[skill.category]}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">{skill.description}</p>
                <div className="mt-4 space-y-2 rounded-xl bg-white/80 p-3 text-sm">
                  <p>
                    <span className="font-medium text-gray-700">{labels.recommended.why}: </span>
                    {labels.reasons[skill.reason_key] ?? skill.reason_key}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">{labels.recommended.impact}: </span>
                    {labels.impacts[skill.impact_key] ?? skill.impact_key}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {scope === "customer" && skill.activation_method === "activate" ? (
                    <button
                      type="button"
                      disabled={installing === skill.key}
                      onClick={() => void activateSkill(skill.key, false)}
                      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {labels.actions.activate}
                    </button>
                  ) : null}
                  <Link
                    href={`${skillsBasePath}/${skill.key}`}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
                  >
                    {labels.actions.learnMore}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section 4 — Marketplace */}
      <section aria-labelledby="skills-marketplace">
        <SectionHeading title={labels.sections.marketplace} />
        {categories.length > 1 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategoryFilter(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${!categoryFilter ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              {labels.marketplace.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${categoryFilter === cat ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                {labels.categories[cat as keyof typeof labels.categories]}
              </button>
            ))}
          </div>
        ) : null}
        {filteredMarketplace.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.marketplace.empty}</p>
        ) : (
          <MarketplaceGrid
            items={filteredMarketplace}
            labels={labels}
            skillsBasePath={skillsBasePath}
            scope={scope}
            installing={installing}
            onActivate={activateSkill}
          />
        )}
      </section>

      {/* Section 5 — Deployment Pipeline */}
      <section aria-labelledby="skills-pipeline">
        <SectionHeading title={labels.sections.pipeline} />
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-6">
          <ol className="flex min-w-[640px] items-center justify-between gap-2">
            {experience.pipeline.map((stage, index) => (
              <li key={stage.key} className="flex flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    index <= 2 ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {stage.order}
                </div>
                <p className="mt-2 text-xs font-medium text-gray-800">
                  {labels.pipelineStages[stage.key]}
                </p>
                {index < experience.pipeline.length - 1 ? (
                  <span className="absolute hidden" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-2">
            {experience.marketplace.slice(0, 8).map((item) => (
              <span
                key={item.key}
                className="rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600 ring-1 ring-gray-200"
              >
                {item.name} · {labels.pipelineStages[item.release_stage]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Governance */}
      {showGovernance ? (
        <section aria-labelledby="skills-governance">
          <SectionHeading title={labels.sections.governance} />
          {experience.governance.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.governance.empty}</p>
          ) : (
            <ul className="space-y-3">
              {experience.governance.map((item) => (
                <li
                  key={`${item.key}-${item.tenant_skill_id ?? "global"}`}
                  className="rounded-2xl border border-gray-200 bg-white p-4 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.status === "pending_approval"
                          ? labels.governance.pendingApproval
                          : labels.governance.underReview}
                      </p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-700">
                      {item.risk_level} {labels.governance.riskLevel.toLowerCase()}
                    </span>
                  </div>
                  <dl className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
                    <div>
                      <dt className="font-medium text-gray-500">{labels.governance.owner}</dt>
                      <dd>{item.owner}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-gray-500">{labels.governance.permissionScope}</dt>
                      <dd className="truncate">{item.permission_scope}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {/* Section 7 — Performance */}
      <section aria-labelledby="skills-performance">
        <SectionHeading title={labels.sections.performance} />
        {experience.performance.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.performance.empty}</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {experience.performance.map((item) => (
              <li
                key={item.key}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-emerald-700">{item.success_rate}%</p>
                    <p className="mt-1 text-[11px] text-gray-500">{labels.performance.successRate}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">{item.usage_frequency}</p>
                    <p className="mt-1 text-[11px] text-gray-500">{labels.performance.actionsPerWeek}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-violet-700">{item.satisfaction_score}/5</p>
                    <p className="mt-1 text-[11px] text-gray-500">{labels.performance.satisfaction}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  {labels.impacts[item.business_impact_key] ?? item.business_impact_key}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-gray-500">{labels.privacy}</p>
    </div>
  );
}

function MarketplaceGrid({
  items,
  labels,
  skillsBasePath,
  scope,
  installing,
  onActivate,
}: {
  items: SkillsMarketplaceCatalogItem[];
  labels: SkillsMarketplaceLabels;
  skillsBasePath: string;
  scope: SkillsMarketplaceScope;
  installing: string | null;
  onActivate: (key: string, requiresApproval: boolean) => void;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.key}
          className={`flex flex-col rounded-2xl border border-gray-200/80 bg-gradient-to-br ${CATEGORY_ACCENT[item.category] ?? CATEGORY_ACCENT.operations} bg-white p-5 shadow-sm`}
        >
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {labels.categories[item.category]}
            </p>
            <h3 className="mt-1 text-base font-semibold text-gray-900">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-3">{item.description}</p>
            <p className="mt-3 text-xs text-gray-500">
              {labels.marketplace.estimatedValue}:{" "}
              {labels.impacts[item.estimated_value_key] ?? item.estimated_value_key}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`${skillsBasePath}/${item.key}`}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700"
            >
              {labels.actions.learnMore}
            </Link>
            {scope === "customer" && item.activation_method === "activate" && !item.installed ? (
              <button
                type="button"
                disabled={installing === item.key}
                onClick={() => onActivate(item.key, item.requires_approval)}
                className="rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                {labels.actions.activate}
              </button>
            ) : (
              <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                {activationLabel(item.activation_method, labels)}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

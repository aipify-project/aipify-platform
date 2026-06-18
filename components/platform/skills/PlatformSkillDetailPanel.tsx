"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseSkillsMarketplaceExperience,
  type SkillsMarketplaceCatalogItem,
  type SkillsMarketplaceLabels,
} from "@/lib/skills-marketplace";

type PlatformSkillDetailPanelProps = {
  skillKey: string;
  labels: SkillsMarketplaceLabels;
};

export function PlatformSkillDetailPanel({ skillKey, labels }: PlatformSkillDetailPanelProps) {
  const [skill, setSkill] = useState<SkillsMarketplaceCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/skills-marketplace?scope=platform");
    if (res.ok) {
      const experience = parseSkillsMarketplaceExperience(await res.json());
      const match = experience?.marketplace.find((item) => item.key === skillKey) ?? null;
      setSkill(match);
    }
    setLoading(false);
  }, [skillKey]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!skill) return <div className="p-8 text-sm text-gray-600">{labels.detail.notFound}</div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link href="/platform/skills" className="text-sm font-medium text-violet-700 hover:underline">
        {labels.detail.back}
      </Link>
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {labels.categories[skill.category]}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">{skill.name}</h1>
        <p className="mt-3 text-sm text-gray-600">{skill.description}</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-gray-500">{labels.governance.riskLevel}</dt>
            <dd className="capitalize">{skill.operational_status}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">{labels.sections.pipeline}</dt>
            <dd>{labels.pipelineStages[skill.release_stage]}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-gray-600">
          {labels.recommended.impact}: {labels.impacts[skill.estimated_value_key]}
        </p>
      </header>
    </div>
  );
}

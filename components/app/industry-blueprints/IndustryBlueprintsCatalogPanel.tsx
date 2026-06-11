"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseIndustryBlueprints, type IndustryBlueprint } from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintsCatalogPanelProps = {
  labels: Record<string, string>;
};

const RISK_COLOR: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

function BlueprintCard({ bp, labels }: { bp: IndustryBlueprint; labels: Record<string, string> }) {
  return (
    <Link
      href={`/app/industry-blueprints/${bp.slug}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-teal-300"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900">{bp.title}</h3>
        <span className={`rounded px-2 py-0.5 text-xs capitalize ${RISK_COLOR[bp.risk_level] ?? "bg-gray-100"}`}>
          {bp.risk_level}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">{bp.short_description}</p>
      <p className="mt-2 text-xs text-gray-500 capitalize">
        {bp.industry_category.replace(/_/g, " ")} · v{bp.version}
      </p>
    </Link>
  );
}

export function IndustryBlueprintsCatalogPanel({ labels }: IndustryBlueprintsCatalogPanelProps) {
  const [blueprints, setBlueprints] = useState<IndustryBlueprint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/industry-blueprints");
    if (res.ok) {
      const data = await res.json();
      setBlueprints(parseIndustryBlueprints(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="space-y-4">
      <Link href="/app/industry-blueprints" className="text-sm text-teal-600 hover:underline">{labels.back}</Link>
      {blueprints.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noBlueprints}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {blueprints.map((bp) => (
            <BlueprintCard key={bp.id} bp={bp} labels={labels} />
          ))}
        </div>
      )}
    </div>
  );
}

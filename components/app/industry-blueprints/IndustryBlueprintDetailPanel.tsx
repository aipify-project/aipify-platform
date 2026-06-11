"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBlueprintDetail } from "@/lib/aipify/industry-blueprints";

type IndustryBlueprintDetailPanelProps = {
  blueprintKey: string;
  labels: Record<string, string>;
};

export function IndustryBlueprintDetailPanel({ blueprintKey, labels }: IndustryBlueprintDetailPanelProps) {
  const [detail, setDetail] = useState<ReturnType<typeof parseBlueprintDetail>>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/industry-blueprints/${encodeURIComponent(blueprintKey)}`);
    if (res.ok) setDetail(parseBlueprintDetail(await res.json()));
    setLoading(false);
  }, [blueprintKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function selectBlueprint() {
    setApplying(true);
    setMessage(null);
    const res = await fetch("/api/aipify/industry-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blueprint_key: blueprintKey }),
    });
    if (res.ok) {
      setMessage(labels.selected);
      await load();
    } else {
      const data = await res.json();
      setMessage(data.error ?? labels.failed);
    }
    setApplying(false);
  }

  async function applyBlueprint(approve = false) {
    setApplying(true);
    setMessage(null);
    const res = await fetch(`/api/aipify/industry-blueprints/${encodeURIComponent(blueprintKey)}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve }),
    });
    const data = await res.json();
    if (data.status === "approval_required") {
      setMessage(labels.approvalRequired);
    } else if (data.status === "applied" || data.status === "partially_applied") {
      setMessage(labels.applied);
      await load();
    } else if (data.status === "precheck_failed") {
      setMessage(data.precheck?.reason ?? labels.precheckFailed);
    } else if (data.error) {
      setMessage(data.error);
    }
    setApplying(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!detail) return <p className="p-6 text-sm text-gray-500">{labels.notFound}</p>;

  const { blueprint, precheck } = detail;
  const manifest = blueprint.blueprint_manifest ?? {};

  const list = (key: string) =>
    Array.isArray(manifest[key]) ? (manifest[key] as string[]) : [];

  return (
    <div className="space-y-6">
      <Link href="/app/industry-blueprints/catalog" className="text-sm text-teal-600 hover:underline">{labels.back}</Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{blueprint.title}</h1>
        <p className="mt-2 text-gray-600">{blueprint.long_description ?? blueprint.short_description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">{labels.riskLevel}</p>
          <p className="mt-1 font-medium capitalize">{blueprint.risk_level}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">{labels.version}</p>
          <p className="mt-1 font-medium">{blueprint.version}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">{labels.deployment}</p>
          <p className="mt-1 font-medium">{blueprint.supported_deployment_modes.join(", ")}</p>
        </div>
      </div>

      {list("recommended_skills").length > 0 ? (
        <ManifestSection title={labels.recommendedSkills} items={list("recommended_skills")} />
      ) : null}
      {list("recommended_marketplace_items").length > 0 ? (
        <ManifestSection title={labels.recommendedPacks} items={list("recommended_marketplace_items")} />
      ) : null}
      {list("recommended_workflows").length > 0 ? (
        <ManifestSection title={labels.recommendedWorkflows} items={list("recommended_workflows")} />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={applying}
          onClick={() => void selectBlueprint()}
          className="rounded-lg border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 disabled:opacity-50"
        >
          {labels.selectBlueprint}
        </button>
        <button
          type="button"
          disabled={applying || !precheck.allowed}
          onClick={() => void applyBlueprint(precheck.requires_approval)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {applying ? labels.applying : precheck.requires_approval ? labels.applyWithApproval : labels.apply}
        </button>
      </div>

      {message ? <p className="text-sm text-gray-700">{message}</p> : null}
      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}

function ManifestSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
        {items.map((item) => (
          <li key={item}>{item.replace(/_/g, " ")}</li>
        ))}
      </ul>
    </section>
  );
}

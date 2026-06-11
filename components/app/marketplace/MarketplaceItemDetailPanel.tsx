"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseMarketplaceItemDetail,
  type MarketplaceItemDetail,
} from "@/lib/aipify/marketplace";

type MarketplaceItemDetailPanelProps = {
  itemKey: string;
  labels: Record<string, string>;
};

export function MarketplaceItemDetailPanel({ itemKey, labels }: MarketplaceItemDetailPanelProps) {
  const [detail, setDetail] = useState<MarketplaceItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/marketplace/items/${encodeURIComponent(itemKey)}`);
    if (res.ok) setDetail(parseMarketplaceItemDetail(await res.json()));
    setLoading(false);
  }, [itemKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function install(approve = false) {
    setInstalling(true);
    setMessage(null);
    const res = await fetch(`/api/aipify/marketplace/items/${encodeURIComponent(itemKey)}/install`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve }),
    });
    const data = await res.json();
    if (data.status === "approval_required") {
      setMessage(labels.approvalRequired);
    } else if (data.status === "installed") {
      setMessage(labels.installed);
      await load();
    } else if (data.status === "precheck_failed") {
      setMessage(data.precheck?.reason ?? labels.precheckFailed);
    } else if (data.error) {
      setMessage(data.error);
    }
    setInstalling(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  if (!detail) return <p className="p-6 text-sm text-gray-500">{labels.notFound}</p>;

  const { item, precheck, reviews } = detail;

  return (
    <div className="space-y-6">
      <Link href="/app/marketplace" className="text-sm text-violet-600 hover:underline">{labels.back}</Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
        <p className="mt-2 text-gray-600">{item.long_description ?? item.short_description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">{labels.riskLevel}</p>
          <p className="mt-1 font-medium capitalize">{item.risk_level}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">{labels.pricing}</p>
          <p className="mt-1 font-medium capitalize">{item.pricing_model}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-sm">
          <p className="text-gray-500">{labels.deployment}</p>
          <p className="mt-1 font-medium">{item.deployment_support.join(", ")}</p>
        </div>
      </div>

      {precheck.included_skills && precheck.included_skills.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold">{labels.includedSkills}</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {precheck.included_skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {precheck.required_permissions && precheck.required_permissions.length > 0 ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-semibold">{labels.permissions}</h2>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {precheck.required_permissions.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {!item.installed ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={installing || !precheck.allowed}
            onClick={() => void install(precheck.requires_approval)}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {installing ? labels.installing : precheck.requires_approval ? labels.installWithApproval : labels.install}
          </button>
        </div>
      ) : (
        <p className="text-sm font-medium text-green-700">{labels.alreadyInstalled}</p>
      )}

      {message ? <p className="text-sm text-gray-700">{message}</p> : null}

      {reviews.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">{labels.reviews}</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {reviews.map((r, i) => (
              <li key={i} className="rounded border border-gray-200 bg-white p-3">
                {"★".repeat(r.rating)} — {r.review_text}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseBusinessPacksFoundationEngineDashboard,
  type BusinessPackRecord,
  type BusinessPacksFoundationEngineDashboard,
} from "@/lib/aipify/business-packs-foundation-engine";

type Props = { labels: Record<string, string> };

export function BusinessPacksFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<BusinessPacksFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/business-packs-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseBusinessPacksFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const activatePack = async (packKey: string) => {
    setActivating(packKey);
    setActionError(null);
    const res = await fetch("/api/aipify/business-packs-foundation-engine/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pack_key: packKey }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.activateFailed);
    } else {
      await load();
    }
    setActivating(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.active_packs && dashboard.active_packs.length > 0 && (
        <PackSection title={labels.activePacks}>
          {dashboard.active_packs.map((item) => (
            <PackCard
              key={item.pack?.pack_key ?? String(item.activation?.id)}
              pack={item.pack}
              badge={item.customization_status}
              labels={labels}
            />
          ))}
        </PackSection>
      )}

      {dashboard.recommended_packs && dashboard.recommended_packs.length > 0 && (
        <PackSection title={labels.recommendedPacks}>
          {dashboard.recommended_packs.map((pack) => (
            <PackCard
              key={pack.pack_key}
              pack={pack}
              onActivate={() => void activatePack(pack.pack_key)}
              activating={activating === pack.pack_key}
              labels={labels}
            />
          ))}
        </PackSection>
      )}

      {dashboard.available_packs && dashboard.available_packs.length > 0 && (
        <PackSection title={labels.availablePacks}>
          {dashboard.available_packs.map((pack) => (
            <PackCard
              key={pack.pack_key}
              pack={pack}
              onActivate={() => void activatePack(pack.pack_key)}
              activating={activating === pack.pack_key}
              labels={labels}
            />
          ))}
        </PackSection>
      )}

      {dashboard.future_packs && dashboard.future_packs.length > 0 && (
        <PackSection title={labels.futurePacks}>
          {dashboard.future_packs.map((pack) => (
            <div key={String(pack.pack_key)} className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{String(pack.pack_name)}</span>
              <span className="ml-2 text-xs uppercase">{labels.comingSoon}</span>
            </div>
          ))}
        </PackSection>
      )}
    </div>
  );
}

function PackSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function PackCard({
  pack,
  badge,
  onActivate,
  activating,
  labels,
}: {
  pack?: BusinessPackRecord;
  badge?: string;
  onActivate?: () => void;
  activating?: boolean;
  labels: Record<string, string>;
}) {
  if (!pack) return null;
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
      <div>
        <p className="font-medium text-gray-900">{pack.pack_name}</p>
        {pack.description && <p className="mt-1 text-sm text-gray-600">{pack.description}</p>}
        <p className="mt-1 text-xs text-gray-500">
          {pack.industry} · v{pack.version ?? "1.0.0"}
          {badge ? ` · ${badge}` : ""}
        </p>
      </div>
      {onActivate && (
        <button
          type="button"
          disabled={activating}
          onClick={onActivate}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {activating ? labels.activating : labels.activate}
        </button>
      )}
    </div>
  );
}

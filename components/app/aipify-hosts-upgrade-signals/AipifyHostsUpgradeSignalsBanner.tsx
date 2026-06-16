"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAipifyHostsUpgradeSignalActionResult,
  parseAipifyHostsUpgradeSignalsCard,
  type HostsUpgradeSignalsCard,
} from "@/lib/aipify/aipify-hosts-upgrade-signals";

type Props = {
  labels: Record<string, string>;
  surface?: string;
  compact?: boolean;
};

export function AipifyHostsUpgradeSignalsBanner({ labels, surface = "embed", compact = false }: Props) {
  const [card, setCard] = useState<HostsUpgradeSignalsCard | null>(null);
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/aipify/aipify-hosts/upgrade-signals/card?surface=${encodeURIComponent(surface)}`);
    if (res.ok) setCard(parseAipifyHostsUpgradeSignalsCard(await res.json()));
  }, [surface]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (actionType: string, payload?: Record<string, unknown>) => {
    if (!card?.primary_recommendation) return;
    setBusy(true);
    const rec = card.primary_recommendation;
    const res = await fetch("/api/aipify/aipify-hosts/upgrade-signals/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: actionType,
        recommendation_key: rec.recommendation_key,
        payload: { ...payload, action_target: rec.action_target },
      }),
    });
    setBusy(false);
    if (!res.ok) return;
    const result = parseAipifyHostsUpgradeSignalActionResult(await res.json());
    if (result.billing_route) {
      window.location.href = result.billing_route;
      return;
    }
    if (result.workspace_route) {
      window.location.href = result.workspace_route;
      return;
    }
    if (result.marketplace_route) {
      window.location.href = result.marketplace_route;
      return;
    }
    await load();
  };

  if (dismissed || !card?.show_banner || !card.primary_recommendation) return null;

  const rec = card.primary_recommendation;
  const atLimit = Boolean(card.licensing?.at_capacity);

  return (
    <div className={`rounded-xl border ${atLimit ? "border-amber-200 bg-amber-50/80" : "border-indigo-100 bg-indigo-50/50"} px-4 py-4`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{rec.title}</p>
          <p className="mt-1 text-sm text-gray-600">{rec.message}</p>
          {!compact && card.principle && (
            <p className="mt-2 text-xs text-gray-500">{card.principle}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {rec.action_type === "upgrade" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("start_upgrade", { target_plan: rec.action_target })}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {labels.upgrade}
            </button>
          )}
          {(rec.action_type === "add_license" || atLimit) && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("add_property_license")}
              className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-50 disabled:opacity-60"
            >
              {labels.addPropertyLicense}
            </button>
          )}
          <Link
            href={rec.routes?.upgrade ?? "/app/settings/billing/packages"}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {labels.viewPlans}
          </Link>
          <Link
            href="/app/aipify-hosts/upgrade-signals"
            className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800"
          >
            {labels.learnMore}
          </Link>
        </div>
      </div>
    </div>
  );
}

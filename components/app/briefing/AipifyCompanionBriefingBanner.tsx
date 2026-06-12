"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCompanionContextBriefing,
  type BriefKeyItem,
  type CompanionBriefingContext,
  type CompanionContextBriefing,
} from "@/lib/aipify/briefing";
import type { CompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";

type AipifyCompanionBriefingBannerProps = {
  context: CompanionBriefingContext;
  labels: CompanionBriefingLabels;
};

const ICON: Record<string, string> = {
  alert: "⚠",
  warning: "⚠",
  info: "✓",
  check: "✓",
};

function itemIcon(item: BriefKeyItem): string {
  if (item.icon && ICON[item.icon]) return ICON[item.icon];
  if (item.severity === "critical" || item.severity === "high") return "⚠";
  return "✓";
}

function BriefingSkeleton({ label }: { label: string }) {
  return (
    <div
      className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-white px-4 py-3"
      aria-busy="true"
      aria-label={label}
    >
      <div className="h-3 w-28 animate-pulse rounded bg-indigo-100" />
      <div className="mt-2 h-4 w-full max-w-xl animate-pulse rounded bg-indigo-50" />
    </div>
  );
}

export function AipifyCompanionBriefingBanner({
  context,
  labels,
}: AipifyCompanionBriefingBannerProps) {
  const [briefing, setBriefing] = useState<CompanionContextBriefing | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/companion-briefing?context=${encodeURIComponent(context)}`);
    if (res.ok) {
      setBriefing(parseCompanionContextBriefing(await res.json()));
    } else {
      setBriefing(null);
    }
    setLoading(false);
  }, [context]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <BriefingSkeleton label={labels.loading} />;
  if (!briefing?.has_customer || briefing.enabled === false || !briefing.summary) return null;

  const items = briefing.key_items ?? [];

  return (
    <section
      className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-indigo-50/40 to-white px-4 py-3 shadow-sm"
      aria-label={labels.companionBriefing}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {labels.companionBriefing}
          </p>
          <p className="mt-1 text-sm text-gray-800">{briefing.summary}</p>
          {briefing.companion_note ? (
            <p className="mt-1 text-xs text-indigo-800/80">{briefing.companion_note}</p>
          ) : null}
        </div>
        <Link
          href="/app/briefing"
          className="shrink-0 text-xs font-medium text-indigo-700 hover:underline"
        >
          {labels.viewDetails}
        </Link>
      </div>

      {items.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {items.slice(0, 3).map((item) => (
            <li key={item.id ?? item.title} className="flex items-start gap-1.5 text-xs text-gray-700">
              <span className="mt-0.5 shrink-0" aria-hidden>
                {itemIcon(item)}
              </span>
              <span>
                {item.action_url ? (
                  <Link href={item.action_url} className="hover:text-indigo-700">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

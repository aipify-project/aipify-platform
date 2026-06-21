"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseUnonightPilotCommandBrief,
  type UnonightPilotCommandBrief,
} from "@/lib/unonight-pilot";

type PilotCommandBriefStripLabels = {
  title: string;
  readOnlyActive: string;
  shadowModeActive: string;
  dataSourceFreshness: string;
  shadowRecommendationPrepared: string;
  sourceFailure: string;
  freshnessFresh: string;
  freshnessStale: string;
  freshnessOutdated: string;
  freshnessUnknown: string;
  principle: string;
};

type PilotCommandBriefStripProps = {
  labels: PilotCommandBriefStripLabels;
};

function freshnessLabel(
  state: string | undefined,
  labels: PilotCommandBriefStripLabels
): string {
  switch (state) {
    case "fresh":
      return labels.freshnessFresh;
    case "stale":
      return labels.freshnessStale;
    case "outdated":
      return labels.freshnessOutdated;
    default:
      return labels.freshnessUnknown;
  }
}

export function PilotCommandBriefStrip({ labels }: PilotCommandBriefStripProps) {
  const [brief, setBrief] = useState<UnonightPilotCommandBrief | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/app/unonight-pilot/brief");
    if (res.ok) setBrief(parseUnonightPilotCommandBrief(await res.json()));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!brief?.found || !brief.pilot_active) return null;

  return (
    <section className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-violet-900">{labels.title}</h3>
        <span className="text-xs font-medium text-violet-700">
          {brief.shadow_mode ? labels.shadowModeActive : labels.readOnlyActive}
        </span>
      </div>
      <p className="mt-2 text-xs text-violet-800">{labels.principle}</p>
      {(brief.data_sources ?? []).length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-violet-900">
          {(brief.data_sources ?? []).map((source) => (
            <li key={source.source_key} className="flex flex-wrap gap-2">
              <span>{source.display_name}</span>
              <span className="text-violet-700">
                {labels.dataSourceFreshness}: {freshnessLabel(source.freshness_state, labels)}
              </span>
              {source.sync_status === "failed" && (
                <span className="text-amber-800">{labels.sourceFailure}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {(brief.shadow_recommendations ?? []).length > 0 && (
        <ul className="mt-3 space-y-2">
          {(brief.shadow_recommendations ?? []).map((rec) => (
            <li key={rec.id} className="rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm">
              <p className="text-xs font-medium text-violet-700">{labels.shadowRecommendationPrepared}</p>
              <p className="font-medium text-gray-900">{rec.title}</p>
              <p className="text-gray-600">{rec.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

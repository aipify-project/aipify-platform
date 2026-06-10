"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/i18n/format-date";
import {
  formatRelativeTime,
  getTimelineCategoryStyle,
  type CustomerTimelineEvent,
  type TimelineCategory,
} from "@/lib/platform/intelligence-foundation";
import { inferActivityCategory } from "@/lib/platform/customer-workspace";
import type { ActivityLogEntry } from "@/lib/platform/types";

type TimelineFilter =
  | "all"
  | TimelineCategory
  | "integrations";

type CustomerActivityTimelineProps = {
  foundationEvents?: CustomerTimelineEvent[];
  legacyEntries?: ActivityLogEntry[];
  locale: string;
  labels: {
    empty: string;
    filterAll: string;
    expandDetails: string;
    categories: Record<string, string>;
  };
};

const FILTER_ORDER: TimelineFilter[] = [
  "all",
  "support",
  "billing",
  "automation",
  "installation",
  "user",
  "integrations",
  "ai_recommendation",
  "subscription",
  "system",
];

function normalizeEvents(
  foundationEvents: CustomerTimelineEvent[],
  legacyEntries: ActivityLogEntry[]
): CustomerTimelineEvent[] {
  if (foundationEvents.length > 0) {
    return [...foundationEvents].sort(
      (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    );
  }
  return legacyEntries.map((entry) => ({
    id: entry.id,
    tenant_id: entry.customer_id,
    category: mapLegacyCategory(entry),
    title: entry.title,
    description: (entry.details?.description as string) ?? entry.event_type,
    metadata: entry.details,
    event_date: entry.created_at,
    created_at: entry.created_at,
  }));
}

function mapLegacyCategory(entry: ActivityLogEntry): TimelineCategory {
  const cat = inferActivityCategory(entry);
  if (cat === "installations") return "installation";
  if (cat === "automations") return "automation";
  if (cat === "users") return "user";
  if (cat === "ai_recommendations") return "ai_recommendation";
  return cat as TimelineCategory;
}

function matchesFilter(event: CustomerTimelineEvent, filter: TimelineFilter): boolean {
  if (filter === "all") return true;
  if (filter === "integrations") {
    return (
      event.category === "installation" &&
      (event.title.toLowerCase().includes("integration") ||
        event.metadata?.provider != null)
    );
  }
  return event.category === filter;
}

export default function CustomerActivityTimeline({
  foundationEvents = [],
  legacyEntries = [],
  locale,
  labels,
}: CustomerActivityTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const events = useMemo(
    () => normalizeEvents(foundationEvents, legacyEntries),
    [foundationEvents, legacyEntries]
  );

  const filtered = useMemo(
    () => events.filter((event) => matchesFilter(event, filter)),
    [events, filter]
  );

  if (events.length === 0) {
    return <p className="text-sm text-gray-500">{labels.empty}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_ORDER.map((filterKey) => {
          const label =
            filterKey === "all"
              ? labels.filterAll
              : labels.categories[filterKey] ?? filterKey;
          return (
            <button
              key={filterKey}
              type="button"
              onClick={() => setFilter(filterKey)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                filter === filterKey
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <ul className="space-y-0">
          {filtered.map((event, index) => {
            const categoryLabel = labels.categories[event.category] ?? event.category;
            const style = getTimelineCategoryStyle(event.category);
            const isExpanded = expandedId === event.id;

            return (
              <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                {index < filtered.length - 1 && (
                  <span
                    className="absolute left-[11px] top-6 h-full w-px bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <span
                  className="relative z-10 mt-1 h-[22px] w-[22px] shrink-0 rounded-full bg-violet-100 ring-4 ring-white"
                  aria-hidden="true"
                >
                  <span className="absolute inset-1 rounded-full bg-violet-500" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${style}`}
                    >
                      {categoryLabel}
                    </span>
                    <div className="text-right">
                      <time className="block text-sm text-gray-500">
                        {formatDate(event.event_date, locale)}
                      </time>
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(event.event_date, locale)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 font-semibold text-gray-900">{event.title}</p>
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  )}
                  {Object.keys(event.metadata ?? {}).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : event.id)}
                      className="mt-2 text-xs font-semibold text-violet-600 hover:text-violet-700"
                    >
                      {labels.expandDetails}
                    </button>
                  )}
                  {isExpanded && (
                    <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

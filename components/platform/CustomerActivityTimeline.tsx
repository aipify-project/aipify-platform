import { formatDate } from "@/lib/i18n/format-date";
import {
  getCategoryStyle,
  inferActivityCategory,
} from "@/lib/platform/customer-workspace";
import type { ActivityLogEntry } from "@/lib/platform/types";

type CustomerActivityTimelineProps = {
  entries: ActivityLogEntry[];
  locale: string;
  labels: {
    empty: string;
    categories: Record<string, string>;
  };
};

export default function CustomerActivityTimeline({
  entries,
  locale,
  labels,
}: CustomerActivityTimelineProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">{labels.empty}</p>;
  }

  return (
    <ul className="space-y-0">
      {entries.map((entry, index) => {
        const category = inferActivityCategory(entry);
        const categoryLabel = labels.categories[category] ?? category;
        return (
          <li key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
            {index < entries.length - 1 && (
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
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${getCategoryStyle(category)}`}
                >
                  {categoryLabel}
                </span>
                <time className="text-sm text-gray-500">
                  {formatDate(entry.created_at, locale)}
                </time>
              </div>
              <p className="mt-2 font-semibold text-gray-900">{entry.title}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import Link from "next/link";
import type { ActionItem } from "@/lib/aipify/action-hub";

const PRIORITY_COLOR: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-blue-100 text-blue-800",
  informational: "bg-gray-100 text-gray-700",
};

type ActionItemListProps = {
  items: ActionItem[];
  empty: string;
  showActions?: boolean;
  labels: Record<string, string>;
  onStatus?: (id: string, status: string) => void;
  acting?: string | null;
};

export function ActionItemList({
  items,
  empty,
  showActions = false,
  labels,
  onStatus,
  acting,
}: ActionItemListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">{empty}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href={`/app/actions/${item.id}`}
                className="font-medium text-gray-900 hover:text-rose-700"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                {item.source_module} · {item.status}
              </p>
              {item.rationale ? (
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">{item.rationale}</p>
              ) : null}
            </div>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs ${PRIORITY_COLOR[item.priority] ?? "bg-gray-100"}`}
            >
              {item.priority}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.action_url ? (
              <Link href={item.action_url} className="text-xs text-rose-700 hover:underline">
                {labels.goToSource}
              </Link>
            ) : null}
            {showActions && onStatus && item.status !== "completed" && item.status !== "dismissed" ? (
              <>
                <button
                  type="button"
                  disabled={acting === item.id}
                  onClick={() => onStatus(item.id, "in_progress")}
                  className="text-xs text-gray-700 hover:underline disabled:opacity-50"
                >
                  {labels.start}
                </button>
                <button
                  type="button"
                  disabled={acting === item.id}
                  onClick={() => onStatus(item.id, "completed")}
                  className="text-xs text-green-700 hover:underline disabled:opacity-50"
                >
                  {labels.complete}
                </button>
                <button
                  type="button"
                  disabled={acting === item.id}
                  onClick={() => onStatus(item.id, "dismissed")}
                  className="text-xs text-gray-500 hover:underline disabled:opacity-50"
                >
                  {labels.dismiss}
                </button>
              </>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

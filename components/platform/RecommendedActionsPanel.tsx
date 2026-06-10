import Link from "next/link";
import type { RecommendedAction } from "@/lib/platform/executive-intelligence";
import PriorityBadge from "./PriorityBadge";

type RecommendedActionsPanelProps = {
  title: string;
  actions: RecommendedAction[];
  priorityLabels: Record<string, string>;
  suggestedActionLabel: string;
  empty: string;
};

export default function RecommendedActionsPanel({
  title,
  actions,
  priorityLabels,
  suggestedActionLabel,
  empty,
}: RecommendedActionsPanelProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {actions.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {actions.map((action) => {
            const content = (
              <div className="flex flex-wrap items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-4 transition hover:border-violet-200 hover:bg-violet-50/30">
                <span className="text-lg" aria-hidden="true">
                  {action.icon === "warning" ? "⚠" : "💡"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-900">{action.title}</p>
                    <PriorityBadge
                      priority={action.priority}
                      label={priorityLabels[action.priority] ?? action.priority}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{action.reason}</p>
                  <p className="mt-2 text-sm text-violet-700">
                    → {suggestedActionLabel}: {action.suggestedAction}
                  </p>
                </div>
              </div>
            );

            return (
              <li key={action.id}>
                {action.href ? (
                  <Link href={action.href} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

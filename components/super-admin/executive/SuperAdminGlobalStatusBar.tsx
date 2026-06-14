"use client";

import Link from "next/link";
import { useSuperAdminOperations } from "../SuperAdminOperationsProvider";
import { countActionItemsRequiringReview } from "@/lib/super-admin/executive-summary";
import type { SuperAdminGlobalStatus } from "@/lib/super-admin/types";

type SuperAdminGlobalStatusBarProps = {
  labels: {
    operational: string;
    warning: string;
    warningCount: string;
    critical: string;
    openActionCenter: string;
  };
};

function resolveStatus(
  center: NonNullable<ReturnType<typeof useSuperAdminOperations>["center"]>
): SuperAdminGlobalStatus {
  if (center.global_status) return center.global_status;
  if ((center.critical_incidents ?? 0) > 0) return "critical";
  if (countActionItemsRequiringReview(center) > 0) return "warning";
  return "operational";
}

export default function SuperAdminGlobalStatusBar({ labels }: SuperAdminGlobalStatusBarProps) {
  const { center, loading } = useSuperAdminOperations();

  if (loading || !center) {
    return (
      <div
        className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 lg:px-8"
        role="status"
        aria-live="polite"
      >
        …
      </div>
    );
  }

  const status = resolveStatus(center);
  const reviewCount = countActionItemsRequiringReview(center);

  const toneClass =
    status === "critical"
      ? "border-red-200 bg-red-50 text-red-900"
      : status === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-emerald-200 bg-emerald-50 text-emerald-950";

  const message =
    status === "critical"
      ? labels.critical
      : status === "warning"
        ? reviewCount > 0
          ? labels.warningCount.replace("{count}", String(reviewCount))
          : labels.warning
        : labels.operational;

  return (
    <Link
      href="/super#action-center"
      className={`flex items-center justify-between border-b px-4 py-2.5 text-sm transition hover:opacity-90 lg:px-8 ${toneClass}`}
      aria-label={labels.openActionCenter}
    >
      <span className="font-medium">{message}</span>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {labels.openActionCenter}
      </span>
    </Link>
  );
}

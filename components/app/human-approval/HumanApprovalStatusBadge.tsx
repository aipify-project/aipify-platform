"use client";

import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { HumanApprovalUiLabels } from "@/lib/core/human-approval/labels-client";
import {
  resolveHumanApprovalAccessModeLabel,
  resolveHumanApprovalRiskLabel,
  resolveHumanApprovalStatusLabel,
} from "@/lib/core/human-approval/labels-client";
import {
  mapCoreHumanApprovalStatusToKind,
  normalizeRiskLevel,
} from "@/lib/core/human-approval/status-labels";

type HumanApprovalStatusBadgeProps = {
  status: string;
  labels: HumanApprovalUiLabels;
};

export function HumanApprovalStatusBadge({ status, labels }: HumanApprovalStatusBadgeProps) {
  return (
    <AipifyStatusBadge
      kind={mapCoreHumanApprovalStatusToKind(status)}
      label={resolveHumanApprovalStatusLabel(labels, status)}
    />
  );
}

type HumanApprovalRiskBadgeProps = {
  level: number;
  labels: HumanApprovalUiLabels;
};

export function HumanApprovalRiskBadge({ level, labels }: HumanApprovalRiskBadgeProps) {
  const normalized = normalizeRiskLevel(level);
  const label = resolveHumanApprovalRiskLabel(labels, normalized);
  const className =
    normalized >= 4
      ? "text-rose-900 bg-rose-50 ring-rose-200"
      : normalized >= 3
        ? "text-orange-900 bg-orange-50 ring-orange-200"
        : normalized >= 2
          ? "text-amber-900 bg-amber-50 ring-amber-200"
          : "text-violet-900 bg-violet-50 ring-violet-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      <span aria-hidden="true">🛡️</span>
      <span>{label}</span>
    </span>
  );
}

type HumanApprovalAccessModeBadgeProps = {
  mode: string;
  labels: HumanApprovalUiLabels;
};

export function HumanApprovalAccessModeBadge({ mode, labels }: HumanApprovalAccessModeBadgeProps) {
  const label = resolveHumanApprovalAccessModeLabel(labels, mode);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 ring-1 ring-inset ring-slate-200">
      <span aria-hidden="true">{mode === "ongoing" ? "↻" : "1×"}</span>
      <span>{label}</span>
    </span>
  );
}

"use client";

import type { AipifyStatusKind } from "@/lib/design/status-system";
import { getAipifyStatusPresentation } from "@/lib/design/status-system";

type Props = {
  kind: AipifyStatusKind;
  label: string;
  className?: string;
};

/** Status badge — icon + text per Design Standard V1 (never color alone). */
export function AipifyStatusBadge({ kind, label, className = "" }: Props) {
  const presentation = getAipifyStatusPresentation(kind);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${presentation.className} ${className}`}
    >
      <span aria-hidden="true">{presentation.icon}</span>
      <span>{label}</span>
    </span>
  );
}

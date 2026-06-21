"use client";

import {
  getSemanticPresentation,
  type SemanticBadgeType,
} from "@/lib/design/semantic-status-system";

type Props = {
  type: SemanticBadgeType;
  value: string;
  label: string;
  a11yLabel?: string;
  className?: string;
};

/** Explicit semantic badge — type must be declared; value is never inferred alone. */
export function SemanticBadge({ type, value, label, a11yLabel, className = "" }: Props) {
  const presentation = getSemanticPresentation(type, value);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${presentation.badgeClassName} ${className}`}
      aria-label={a11yLabel ?? label}
    >
      <span aria-hidden="true">{presentation.icon}</span>
      <span>{label}</span>
    </span>
  );
}

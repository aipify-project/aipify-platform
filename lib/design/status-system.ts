/**
 * Aipify status system — icon + text, never color alone.
 * Design Standard V1
 */

export type AipifyStatusKind =
  | "completed"
  | "not_allowed"
  | "needs_attention"
  | "information"
  | "restricted"
  | "verified"
  | "waiting";

export type AipifyStatusPresentation = {
  kind: AipifyStatusKind;
  icon: string;
  labelKey: string;
  className: string;
};

export const AipifyStatusPresentations: Record<AipifyStatusKind, AipifyStatusPresentation> = {
  completed: {
    kind: "completed",
    icon: "✅",
    labelKey: "common.status.completed",
    className: "text-emerald-800 bg-emerald-50 ring-emerald-200",
  },
  not_allowed: {
    kind: "not_allowed",
    icon: "❌",
    labelKey: "common.status.notAllowed",
    className: "text-red-800 bg-red-50 ring-red-200",
  },
  needs_attention: {
    kind: "needs_attention",
    icon: "⚠️",
    labelKey: "common.status.needsAttention",
    className: "text-amber-900 bg-amber-50 ring-amber-200",
  },
  information: {
    kind: "information",
    icon: "ℹ️",
    labelKey: "common.status.information",
    className: "text-aipify-accent bg-aipify-accent-soft ring-aipify-accent-muted",
  },
  restricted: {
    kind: "restricted",
    icon: "🔒",
    labelKey: "common.status.restricted",
    className: "text-violet-900 bg-violet-50 ring-violet-200",
  },
  verified: {
    kind: "verified",
    icon: "🛡️",
    labelKey: "common.status.verified",
    className: "text-emerald-900 bg-emerald-50 ring-emerald-200",
  },
  waiting: {
    kind: "waiting",
    icon: "⏳",
    labelKey: "common.status.waiting",
    className: "text-aipify-text-secondary bg-aipify-surface-muted ring-aipify-border",
  },
};

export function getAipifyStatusPresentation(kind: AipifyStatusKind): AipifyStatusPresentation {
  return AipifyStatusPresentations[kind];
}

import type { KompisOperatorRiskClass } from "./tools-registry";

export type KompisOperatorSeverityTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "muted";

export function riskClassTone(
  riskClass: KompisOperatorRiskClass,
  phase: "idle" | "pending" | "success" | "blocked" | "failed",
): KompisOperatorSeverityTone {
  if (phase === "failed" || phase === "blocked" || riskClass === 3) return "danger";
  if (phase === "success") return "success";
  if (phase === "pending" || riskClass === 2 || riskClass === 1) return "warning";
  if (riskClass === 0) return "info";
  return "neutral";
}

export function runStatusTone(status: string): KompisOperatorSeverityTone {
  switch (status) {
    case "completed":
      return "success";
    case "awaiting_approval":
    case "executing":
    case "verifying":
    case "planning":
    case "understanding":
    case "checking_access":
    case "planned":
    case "partial":
    case "attention":
      return "warning";
    case "failed":
    case "blocked":
    case "rejected":
      return "danger";
    default:
      return "muted";
  }
}

export function providerReadinessTone(
  status: "not_configured" | "ready" | "degraded" | "cooldown" | "unavailable" | "disabled" | string,
): KompisOperatorSeverityTone {
  switch (status) {
    case "ready":
      return "success";
    case "degraded":
    case "cooldown":
      return "warning";
    case "unavailable":
      return "danger";
    case "disabled":
      return "muted";
    case "not_configured":
    default:
      return "info";
  }
}

export const SEVERITY_BADGE_CLASS: Record<KompisOperatorSeverityTone, string> = {
  neutral:
    "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200",
  info: "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200",
  muted:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
};

export const GOVERNANCE_TABS = [
  "overview",
  "permissions",
  "capabilities",
  "actions",
  "oversight",
  "approvals",
  "policies",
  "reports",
  "executive",
  "audit",
] as const;

export const CONFIDENCE_BADGES: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  limited: "bg-orange-50 text-orange-800 ring-orange-200",
};

export const TRUST_LABEL_BADGES: Record<string, string> = {
  trusted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  needs_review: "bg-amber-50 text-amber-800 ring-amber-200",
  governance_risk: "bg-red-50 text-red-800 ring-red-200",
};

export const SEVERITY_BADGES: Record<string, string> = {
  info: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  attention: "bg-amber-50 text-amber-800 ring-amber-200",
  risk: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

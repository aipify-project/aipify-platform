export const ENGINE_STATUSES = ["healthy", "attention_required", "critical", "disabled"] as const;
export const FLAG_STATUSES = ["enabled", "disabled", "beta", "enterprise_only"] as const;

export const ENGINE_STATUS_BADGES: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  attention_required: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
  disabled: "bg-zinc-50 text-zinc-600 ring-zinc-200",
};

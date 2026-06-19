export const TRUST_STATUSES = ["trusted", "attention_required", "action_required", "restricted"] as const;
export const VERIFICATION_STATUSES = ["pending", "verified", "review_required", "failed"] as const;
export const DEVICE_STATUSES = ["trusted", "unrecognized", "suspicious", "blocked"] as const;
export const SECURITY_LABELS = ["excellent", "healthy", "needs_attention", "critical"] as const;

export const TRUST_STATUS_BADGES: Record<string, string> = {
  trusted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  attention_required: "bg-amber-50 text-amber-800 ring-amber-200",
  action_required: "bg-orange-50 text-orange-800 ring-orange-200",
  restricted: "bg-red-50 text-red-800 ring-red-200",
};

export const DEVICE_STATUS_BADGES: Record<string, string> = {
  trusted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  unrecognized: "bg-amber-50 text-amber-800 ring-amber-200",
  suspicious: "bg-orange-50 text-orange-800 ring-orange-200",
  blocked: "bg-red-50 text-red-800 ring-red-200",
};

export const VERIFICATION_STATUS_BADGES: Record<string, string> = {
  pending: "bg-zinc-50 text-zinc-700 ring-zinc-200",
  verified: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review_required: "bg-amber-50 text-amber-800 ring-amber-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
};

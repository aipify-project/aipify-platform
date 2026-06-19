export const REAL_WORLD_TABS = [
  "overview",
  "requests",
  "approvals",
  "providers",
  "bookings",
  "deliveries",
  "executions",
  "reports",
  "executive",
] as const;

export const BOOKING_STATUS_BADGES: Record<string, string> = {
  pending: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  requires_review: "bg-amber-50 text-amber-800 ring-amber-200",
  cancelled: "bg-red-50 text-red-800 ring-red-200",
};

export const APPROVAL_LEVEL_BADGES: Record<string, string> = {
  employee: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  manager: "bg-blue-50 text-blue-800 ring-blue-200",
  department: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  finance: "bg-amber-50 text-amber-800 ring-amber-200",
  executive: "bg-purple-50 text-purple-800 ring-purple-200",
};

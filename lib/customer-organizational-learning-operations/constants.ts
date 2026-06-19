export const ORGANIZATIONAL_LEARNING_TABS = [
  "overview",
  "lessons",
  "reviews",
  "projects",
  "improvements",
  "successes",
  "recommendations",
  "reports",
] as const;

export const LEARNING_STATUS_BADGES: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  improving: "bg-green-50 text-green-800 ring-green-200",
  stagnating: "bg-amber-50 text-amber-800 ring-amber-200",
  improvement_needed: "bg-red-50 text-red-800 ring-red-200",
};

export const PIPELINE_STAGE_BADGES: Record<string, string> = {
  suggestion: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  review: "bg-blue-50 text-blue-800 ring-blue-200",
  approval: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  implementation: "bg-violet-50 text-violet-800 ring-violet-200",
  outcome: "bg-purple-50 text-purple-800 ring-purple-200",
  validation: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export const LESSON_STATUS_BADGES: Record<string, string> = {
  open: "bg-amber-50 text-amber-800 ring-amber-200",
  reviewed: "bg-blue-50 text-blue-800 ring-blue-200",
  improvement_planned: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  implemented: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const PATTERN_TYPE_BADGES: Record<string, string> = {
  repeated_delay: "bg-orange-50 text-orange-800 ring-orange-200",
  approval_issue: "bg-red-50 text-red-800 ring-red-200",
  customer_complaint: "bg-amber-50 text-amber-800 ring-amber-200",
  supplier_problem: "bg-violet-50 text-violet-800 ring-violet-200",
  project_failure: "bg-red-50 text-red-800 ring-red-200",
  custom: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

export const PRIORITY_BADGES: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  moderate: "bg-blue-50 text-blue-800 ring-blue-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

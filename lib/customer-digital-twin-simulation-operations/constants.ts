export const DIGITAL_TWIN_SIMULATION_TABS = [
  "overview",
  "models",
  "scenarios",
  "forecasts",
  "impacts",
  "experiments",
  "reports",
] as const;

export const IMPACT_DIRECTION_BADGES: Record<string, string> = {
  positive: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  negative: "bg-red-50 text-red-800 ring-red-200",
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  mixed: "bg-amber-50 text-amber-800 ring-amber-200",
};

export const IMPACT_MAGNITUDE_BADGES: Record<string, string> = {
  low: "bg-green-50 text-green-800 ring-green-200",
  moderate: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-orange-50 text-orange-800 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};

export const SCENARIO_STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  ready: "bg-blue-50 text-blue-800 ring-blue-200",
  simulated: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

export const EXPERIMENT_STATUS_BADGES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  running: "bg-blue-50 text-blue-800 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

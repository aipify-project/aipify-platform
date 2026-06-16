export * from "./types";
export * from "./parse";

export const BUSINESS_PACK_IDENTITY_STATUS_KEYS = [
  "active",
  "beta",
  "coming_soon",
  "deprecated",
  "retired",
] as const;

export const STATUS_BADGE_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  beta: "bg-sky-50 text-sky-800 ring-sky-200",
  coming_soon: "bg-violet-50 text-violet-800 ring-violet-200",
  deprecated: "bg-amber-50 text-amber-900 ring-amber-200",
  retired: "bg-gray-100 text-gray-600 ring-gray-200",
};

export function packLandingRoute(packKey: string): string {
  return `/app/marketplace/packs/${packKey}`;
}

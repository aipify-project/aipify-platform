/** Server-only Kompis model profiles — clients cannot select these. */

export type KompisModelCostClass = "low" | "standard";

export type KompisModelProfile = {
  id: string;
  providerFamily: "openai_compatible";
  modelAlias: string;
  purpose: "planner" | "fallback" | "summary";
  maxInput: number;
  maxOutput: number;
  timeoutMs: number;
  retry: number;
  temperature: number;
  costClass: KompisModelCostClass;
  enabled: boolean;
  fallbackProfileId: string | null;
  toolAccess: "none" | "allowlist";
};

export const KOMPIS_MODEL_PROFILES: KompisModelProfile[] = [
  {
    id: "kompis_planner_balanced_v1",
    providerFamily: "openai_compatible",
    modelAlias: "gpt-4.1-mini",
    purpose: "planner",
    maxInput: 4000,
    maxOutput: 4000,
    timeoutMs: 12_000,
    retry: 1,
    temperature: 0,
    costClass: "standard",
    enabled: true,
    fallbackProfileId: "kompis_planner_fallback_v1",
    toolAccess: "allowlist",
  },
  {
    id: "kompis_planner_fallback_v1",
    providerFamily: "openai_compatible",
    modelAlias: "gpt-4.1-mini",
    purpose: "fallback",
    maxInput: 3000,
    maxOutput: 2000,
    timeoutMs: 8_000,
    retry: 0,
    temperature: 0,
    costClass: "low",
    enabled: true,
    fallbackProfileId: null,
    toolAccess: "allowlist",
  },
  {
    id: "kompis_result_summary_v1",
    providerFamily: "openai_compatible",
    modelAlias: "gpt-4.1-mini",
    purpose: "summary",
    maxInput: 2000,
    maxOutput: 800,
    timeoutMs: 8_000,
    retry: 0,
    temperature: 0,
    costClass: "low",
    enabled: true,
    fallbackProfileId: null,
    toolAccess: "none",
  },
];

export function getKompisModelProfile(id: string): KompisModelProfile | null {
  return KOMPIS_MODEL_PROFILES.find((profile) => profile.id === id && profile.enabled) ?? null;
}

export function resolveKompisPlannerProfile(): KompisModelProfile {
  return getKompisModelProfile("kompis_planner_balanced_v1") ?? KOMPIS_MODEL_PROFILES[0];
}

export function resolveKompisHealthProfile(): KompisModelProfile {
  return getKompisModelProfile("kompis_planner_fallback_v1") ?? resolveKompisPlannerProfile();
}

export type LearningGovernanceOverview = {
  rollout_pipeline: Array<{ stage: string; status: string }>;
  safeguards: string[];
  pilot: { tenant_slug: string; active_memories: number };
  totals: {
    active_memories: number;
    disabled_tenants: number;
    adaptive_tenants: number;
  };
};

export function parseLearningGovernanceOverview(data: unknown): LearningGovernanceOverview {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    rollout_pipeline: Array.isArray(raw.rollout_pipeline)
      ? (raw.rollout_pipeline as Array<{ stage: string; status: string }>)
      : [],
    safeguards: Array.isArray(raw.safeguards) ? (raw.safeguards as string[]) : [],
    pilot: {
      tenant_slug: String((raw.pilot as Record<string, unknown>)?.tenant_slug ?? "unonight"),
      active_memories: Number((raw.pilot as Record<string, unknown>)?.active_memories ?? 0),
    },
    totals: {
      active_memories: Number((raw.totals as Record<string, unknown>)?.active_memories ?? 0),
      disabled_tenants: Number((raw.totals as Record<string, unknown>)?.disabled_tenants ?? 0),
      adaptive_tenants: Number((raw.totals as Record<string, unknown>)?.adaptive_tenants ?? 0),
    },
  };
}

import type { NormalizedMemoryObservation } from "../types";
import { UNONIGHT_MEMORY_OBSERVATIONS } from "../presets/unonight-memory";

export function collectPresetMemoryObservations(tenantSlug?: string): NormalizedMemoryObservation[] {
  if (tenantSlug === "unonight") return [...UNONIGHT_MEMORY_OBSERVATIONS];
  return [];
}

export function observationsToRpcPayload(observations: NormalizedMemoryObservation[]): Record<string, unknown>[] {
  return observations.map((o) => ({
    source_module: o.source_module,
    source_type: o.source_type,
    observation_key: o.observation_key,
    summary: o.summary,
    scope_level: o.scope_level ?? "user",
    metadata: o.metadata ?? {},
    observed_at: o.observed_at ?? new Date().toISOString(),
  }));
}

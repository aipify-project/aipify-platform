export type PlatformDataAvailability = "live" | "partial" | "stale" | "unavailable" | "error";

export type PlatformDataFreshness = {
  source: string;
  fetchedAt: string | null;
  calculatedAt: string | null;
  syncedAt: string | null;
  availability: PlatformDataAvailability;
  staleAfterSeconds: number | null;
  retryState: "idle" | "retrying" | "failed" | null;
  partial: boolean;
};

export function buildFreshness(input: {
  source: string;
  fetchedAt?: string | null;
  calculatedAt?: string | null;
  syncedAt?: string | null;
  availability?: PlatformDataAvailability;
  staleAfterSeconds?: number | null;
  retryState?: PlatformDataFreshness["retryState"];
  partial?: boolean;
}): PlatformDataFreshness {
  return {
    source: input.source,
    fetchedAt: input.fetchedAt ?? null,
    calculatedAt: input.calculatedAt ?? null,
    syncedAt: input.syncedAt ?? null,
    availability: input.availability ?? "live",
    staleAfterSeconds: input.staleAfterSeconds ?? null,
    retryState: input.retryState ?? "idle",
    partial: Boolean(input.partial),
  };
}

export function resolveMetricDisplay(
  value: number | null | undefined,
  availability: PlatformDataAvailability,
): { kind: "value"; value: number } | { kind: "unavailable" } | { kind: "error" } {
  if (availability === "error") return { kind: "error" };
  if (availability === "unavailable" || value === null || value === undefined) {
    return { kind: "unavailable" };
  }
  return { kind: "value", value };
}

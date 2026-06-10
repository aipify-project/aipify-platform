import type { InstallHealthDimension, InstallHealthInput } from "./types";

export const INSTALL_HEALTH_DIMENSIONS: readonly InstallHealthDimension[] = [
  "connectivity",
  "skill_adoption",
  "support_effectiveness",
  "recommendation_acceptance",
  "operational_stability",
] as const;

const DEFAULT_WEIGHTS: Record<InstallHealthDimension, number> = {
  connectivity: 0.3,
  skill_adoption: 0.2,
  support_effectiveness: 0.2,
  recommendation_acceptance: 0.15,
  operational_stability: 0.15,
};

export type InstallMaturityResult = {
  score: number;
  status: "healthy" | "needs_attention" | "critical";
  dimensions: Record<InstallHealthDimension, number>;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * Calculates installation maturity (INSTALL_ENGINE.md §15).
 * Each dimension is 0–100; missing dimensions default to 50 (neutral).
 */
export function computeInstallMaturityScore(
  input: InstallHealthInput
): InstallMaturityResult {
  const dimensions = Object.fromEntries(
    INSTALL_HEALTH_DIMENSIONS.map((dimension) => [
      dimension,
      clampScore(input[dimension] ?? 50),
    ])
  ) as Record<InstallHealthDimension, number>;

  const weighted = INSTALL_HEALTH_DIMENSIONS.reduce((sum, dimension) => {
    return sum + dimensions[dimension] * DEFAULT_WEIGHTS[dimension];
  }, 0);

  const score = clampScore(weighted);
  const status =
    score >= 75 ? "healthy" : score >= 50 ? "needs_attention" : "critical";

  return { score, status, dimensions };
}

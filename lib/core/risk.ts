export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export function isHigherRisk(a: RiskLevel, b: RiskLevel): boolean {
  const order: Record<RiskLevel, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  };
  return order[a] > order[b];
}

export function requiresHumanApproval(risk: RiskLevel): boolean {
  return risk === "high" || risk === "critical";
}

export function isManualOnly(risk: RiskLevel): boolean {
  return risk === "critical";
}

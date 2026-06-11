import type { PulseStatus } from "../dimensions";
import type { PulseMetric } from "../types";

const STATUS_RANK: PulseStatus[] = [
  "requires_action",
  "needs_attention",
  "worth_reviewing",
  "normal",
];

export type PulseAdapterResult = {
  area: string;
  metrics: PulseMetric[];
  area_status: PulseStatus;
  summary: string;
};

export type PulseAdapter = {
  area: string;
  collect(tenantId: string, context: Record<string, unknown>): PulseAdapterResult;
};

export function worstPulseStatus(statuses: PulseStatus[]): PulseStatus {
  return statuses.reduce((worst, status) => {
    return STATUS_RANK.indexOf(status) < STATUS_RANK.indexOf(worst) ? status : worst;
  }, "normal" as PulseStatus);
}

export function deriveStatus(differencePercent: number): PulseStatus {
  const abs = Math.abs(differencePercent);
  if (abs < 15) return "normal";
  if (abs < 30) return "worth_reviewing";
  if (abs < 50) return "needs_attention";
  return "requires_action";
}

export function buildMetric(
  metricName: string,
  current: number,
  expected: number,
  explanation: string,
  recommendation: string
): PulseMetric {
  const diff =
    expected === 0 ? (current === 0 ? 0 : 100) : ((current - expected) / expected) * 100;
  return {
    metric_name: metricName,
    current_value: current,
    expected_value: expected,
    difference_percent: Math.round(diff),
    direction: diff > 5 ? "up" : diff < -5 ? "down" : "stable",
    status: deriveStatus(diff),
    explanation,
    recommendation,
  };
}

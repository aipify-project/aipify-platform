export type AnalyticsPeriodKey = "7d" | "30d" | "90d" | "365d" | "all";

export type AnalyticsPeriod = {
  key: AnalyticsPeriodKey;
  /** Inclusive lower bound; null means unbounded. */
  since: Date | null;
  labelKey: string;
};

const DAY_MS = 86_400_000;

export function parseAnalyticsPeriod(raw: string | null | undefined): AnalyticsPeriod {
  const key = (raw ?? "30d").trim().toLowerCase() as AnalyticsPeriodKey;
  const now = Date.now();
  switch (key) {
    case "7d":
      return { key, since: new Date(now - 7 * DAY_MS), labelKey: "period7d" };
    case "90d":
      return { key, since: new Date(now - 90 * DAY_MS), labelKey: "period90d" };
    case "365d":
      return { key, since: new Date(now - 365 * DAY_MS), labelKey: "period365d" };
    case "all":
      return { key, since: null, labelKey: "periodAll" };
    case "30d":
    default:
      return { key: "30d", since: new Date(now - 30 * DAY_MS), labelKey: "period30d" };
  }
}

/**
 * Core `get_platform_metrics` currently exposes a fixed 30d growth window.
 * Period filters that are not 30d mark growth cards as limited_to_core_window.
 */
export function periodMatchesCoreGrowthWindow(period: AnalyticsPeriod): boolean {
  return period.key === "30d";
}

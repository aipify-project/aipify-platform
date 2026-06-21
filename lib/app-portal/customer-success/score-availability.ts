import type { HealthState } from "@/lib/design/semantic-status-system";
import { mapHealthScoreToHealthState } from "@/lib/design/semantic-status-system";

export const SCORE_AVAILABILITY_STATES = [
  "available",
  "awaiting_first_sync",
  "calculating",
  "insufficient_data",
  "stale",
  "source_unavailable",
  "calculation_failed",
] as const;

export type ScoreAvailability = (typeof SCORE_AVAILABILITY_STATES)[number];

export type SourceFreshness = "current" | "delayed" | "stale" | "unavailable";

export type ScoreEntry = {
  score: number | null;
  availability: ScoreAvailability;
  calculatedAt: string | null;
  sourceFreshness: SourceFreshness;
  explanationKey: string;
};

export type CustomerSuccessScores = {
  health: ScoreEntry;
  adoption: ScoreEntry;
  utilization: ScoreEntry;
  engagement: ScoreEntry;
};

export type PilotStatus = {
  active: boolean;
  readOnly: boolean;
  shadowMode: boolean;
  healthState: string | null;
  lastSuccessfulSync: string | null;
  dataFreshness: SourceFreshness | "awaiting_first_sync";
  connectedSourceCount: number;
};

const AVAILABILITY_SET = new Set<string>(SCORE_AVAILABILITY_STATES);

export function parseScoreEntry(raw: unknown): ScoreEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const availability = String(d.availability ?? "");
  if (!AVAILABILITY_SET.has(availability)) return null;
  return {
    score: typeof d.score === "number" ? d.score : d.score === null ? null : null,
    availability: availability as ScoreAvailability,
    calculatedAt: typeof d.calculated_at === "string" ? d.calculated_at : typeof d.calculatedAt === "string" ? d.calculatedAt : null,
    sourceFreshness: (["current", "delayed", "stale", "unavailable"].includes(String(d.source_freshness ?? d.sourceFreshness))
      ? String(d.source_freshness ?? d.sourceFreshness)
      : "unavailable") as SourceFreshness,
    explanationKey: String(d.explanation_key ?? d.explanationKey ?? "customerApp.portalStructure.customerSuccess.scoreAvailability.insufficientData"),
  };
}

export function parseCustomerSuccessScores(raw: unknown): CustomerSuccessScores | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const health = parseScoreEntry(d.health);
  const adoption = parseScoreEntry(d.adoption);
  const utilization = parseScoreEntry(d.utilization);
  const engagement = parseScoreEntry(d.engagement);
  if (!health || !adoption || !utilization || !engagement) return null;
  return { health, adoption, utilization, engagement };
}

export function parsePilotStatus(raw: unknown): PilotStatus | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (d.active !== true) return null;
  const freshness = String(d.data_freshness ?? d.dataFreshness ?? "unavailable");
  return {
    active: true,
    readOnly: d.read_only === true || d.readOnly === true,
    shadowMode: d.shadow_mode === true || d.shadowMode === true,
    healthState: typeof d.health_state === "string" ? d.health_state : typeof d.healthState === "string" ? d.healthState : null,
    lastSuccessfulSync:
      typeof d.last_successful_sync === "string"
        ? d.last_successful_sync
        : typeof d.lastSuccessfulSync === "string"
          ? d.lastSuccessfulSync
          : null,
    dataFreshness: (freshness === "awaiting_first_sync" ? "awaiting_first_sync" : freshness) as PilotStatus["dataFreshness"],
    connectedSourceCount: typeof d.connected_source_count === "number" ? d.connected_source_count : typeof d.connectedSourceCount === "number" ? d.connectedSourceCount : 0,
  };
}

export function legacyScoresToEntries(
  data: {
    health_score?: number;
    adoption_score?: number;
    utilization_score?: number;
    engagement_score?: number;
    health_state?: string;
    last_updated_at?: string;
    journey_started?: boolean;
  },
  journeyStarted: boolean
): CustomerSuccessScores {
  const calculatedAt = data.last_updated_at ?? null;
  const build = (score: number | undefined, hasJourney: boolean): ScoreEntry => {
    if (!hasJourney) {
      return {
        score: null,
        availability: "insufficient_data",
        calculatedAt: null,
        sourceFreshness: "unavailable",
        explanationKey: "customerApp.portalStructure.customerSuccess.scoreAvailability.insufficientData",
      };
    }
    const value = typeof score === "number" ? score : null;
    return {
      score: value,
      availability: "available",
      calculatedAt,
      sourceFreshness: "current",
      explanationKey: "customerApp.portalStructure.customerSuccess.scoreAvailability.available",
    };
  };
  return {
    health: build(data.health_score, journeyStarted),
    adoption: build(data.adoption_score, journeyStarted),
    utilization: build(data.utilization_score, journeyStarted),
    engagement: build(data.engagement_score, journeyStarted),
  };
}

export function resolveScoreHealthState(entry: ScoreEntry): HealthState | null {
  if (entry.availability !== "available" || entry.score === null) return null;
  return mapHealthScoreToHealthState(entry.score);
}

export function formatScoreDisplayValue(entry: ScoreEntry): string {
  if (entry.availability !== "available" || entry.score === null) return "—";
  return String(entry.score);
}

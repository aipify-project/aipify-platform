import type {
  AbosCommandCenterOverview,
  AbosCommandCenterPriorityItem,
  AbosCommandCenterRecommendation,
  AbosCommandCenterTimelineEvent,
  AbosCompanionBriefing,
  AbosCapacityOverview,
  AbosCustomerHealthOverview,
  AbosMomentumOverview,
  AbosResilienceOverview,
  AbosRiskOverview,
  AbosStrategicOverview,
  AbosSuccessOverview,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseBriefing(raw: unknown): AbosCompanionBriefing | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const lines = Array.isArray(d.lines)
    ? d.lines.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          key: str(row.key),
          count: typeof row.count === "number" ? row.count : undefined,
          status: str(row.status) || undefined,
        };
      })
    : [];
  return {
    greeting_key: str(d.greeting_key, "goodMorning"),
    lines,
    closing_key: str(d.closing_key, "focusPrioritiesToday"),
  };
}

function parsePriorities(raw: unknown): AbosCommandCenterPriorityItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      category: str(d.category),
      priority: str(d.priority),
    };
  });
}

function parseRecommendations(raw: unknown): AbosCommandCenterRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      key: str(d.key),
      priority: str(d.priority),
      type: str(d.type),
    };
  });
}

function parseStrategic(raw: unknown): AbosStrategicOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    on_track: num(d.on_track),
    delayed: num(d.delayed),
    milestones_achieved: num(d.milestones_achieved),
  };
}

function parseMomentum(raw: unknown): AbosMomentumOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    score: num(d.score),
    teams_accelerating: num(d.teams_accelerating),
    initiatives_slowing: num(d.initiatives_slowing),
    bottlenecks: num(d.bottlenecks),
  };
}

function parseResilience(raw: unknown): AbosResilienceOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    score: num(d.score),
    vulnerabilities: num(d.vulnerabilities),
    continuity_readiness: num(d.continuity_readiness),
  };
}

function parseCapacity(raw: unknown): AbosCapacityOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    teams_approaching_limits: num(d.teams_approaching_limits),
    healthy_distribution: num(d.healthy_distribution),
    capacity_risks: num(d.capacity_risks),
  };
}

function parseRisk(raw: unknown): AbosRiskOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    high_priority: num(d.high_priority),
    recently_mitigated: num(d.recently_mitigated),
  };
}

function parseSuccess(raw: unknown): AbosSuccessOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    milestones_achieved: num(d.milestones_achieved),
    high_performing: num(d.high_performing),
  };
}

function parseCustomerHealth(raw: unknown): AbosCustomerHealthOverview | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    adoption_score: num(d.adoption_score),
    learning_score: num(d.learning_score),
    support_engagement: num(d.support_engagement),
  };
}

export function parseAbosCommandCenterOverview(data: unknown): AbosCommandCenterOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_limited: d.can_limited === true,
    briefing_started: d.briefing_started === true,
    companion_briefing: parseBriefing(d.companion_briefing),
    organizational_status: str(d.organizational_status),
    todays_priorities: parsePriorities(d.todays_priorities),
    strategic_overview: parseStrategic(d.strategic_overview),
    momentum_overview: parseMomentum(d.momentum_overview),
    resilience_overview: parseResilience(d.resilience_overview),
    capacity_overview: parseCapacity(d.capacity_overview),
    risk_overview: parseRisk(d.risk_overview),
    success_overview: parseSuccess(d.success_overview),
    customer_health_overview: parseCustomerHealth(d.customer_health_overview),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseAbosCommandCenterTimeline(data: unknown): AbosCommandCenterTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.timeline)) return [];
  return d.timeline.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
    };
  });
}

export function parseAbosCommandCenterRecommendations(data: unknown): AbosCommandCenterRecommendation[] {
  if (!data || typeof data !== "object") return [];
  return parseRecommendations((data as Record<string, unknown>).recommendations);
}

export function parseAbosCommandCenterBriefing(data: unknown): AbosCompanionBriefing | undefined {
  if (!data || typeof data !== "object") return undefined;
  return parseBriefing((data as Record<string, unknown>).briefing);
}

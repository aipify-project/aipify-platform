import type {
  BoardInvestorIntelligenceCenter,
  GovernanceStatus,
  PerformanceIndicator,
} from "./types";

const GOV = new Set<GovernanceStatus>(["strong", "healthy", "monitor", "needs_attention", "critical"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}
function num(v: unknown, fb = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fb;
}
function bool(v: unknown): boolean {
  return v === true;
}

function parseIndicator(raw: unknown): PerformanceIndicator {
  if (!raw || typeof raw !== "object") return { score: 75, status: "healthy" };
  const d = raw as Record<string, unknown>;
  const st = str(d.status, "healthy");
  return {
    score: num(d.score, 75),
    status: GOV.has(st as GovernanceStatus) ? (st as GovernanceStatus) : "healthy",
    note: str(d.note) || undefined,
  };
}

export function parseBoardInvestorIntelligenceCenter(data: unknown): BoardInvestorIntelligenceCenter {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (!bool(d.found)) return { found: false };

  const bd = d.board_dashboard as Record<string, unknown> | undefined;
  const ir = d.investor_readiness as Record<string, unknown> | undefined;
  const bm = d.board_meeting as Record<string, unknown> | undefined;
  const sp = d.strategic_performance as Record<string, unknown> | undefined;
  const ib = d.investor_briefing as Record<string, unknown> | undefined;
  const gh = d.governance_health as Record<string, unknown> | undefined;
  const en = d.executive_narrative as Record<string, unknown> | undefined;

  return {
    found: true,
    has_access: d.has_access !== undefined ? bool(d.has_access) : undefined,
    upgrade_required: bool(d.upgrade_required),
    board_dashboard: bd
      ? {
          initiatives_on_track: num(bd.initiatives_on_track),
          initiatives_at_risk: num(bd.initiatives_at_risk),
          executive_priorities: num(bd.executive_priorities),
          organization_health_score: num(bd.organization_health_score, 85),
          organization_health_status: str(bd.organization_health_status),
          financial_trend_summary: str(bd.financial_trend_summary),
          risk_landscape_count: num(bd.risk_landscape_count),
          major_opportunities: num(bd.major_opportunities),
          board_attention_items: Array.isArray(bd.board_attention_items)
            ? bd.board_attention_items.map((i) => {
                const row = i as Record<string, unknown>;
                return { id: str(row.id), title: str(row.title), reason: str(row.reason) };
              })
            : [],
        }
      : undefined,
    investor_readiness: ir
      ? {
          revenue_trajectory: str(ir.revenue_trajectory),
          revenue_trajectory_note: str(ir.revenue_trajectory_note),
          customer_growth_indicator: num(ir.customer_growth_indicator),
          retention_indicator: num(ir.retention_indicator),
          product_adoption_trend: str(ir.product_adoption_trend),
          expansion_readiness: str(ir.expansion_readiness),
          operational_maturity: GOV.has(str(ir.operational_maturity) as GovernanceStatus)
            ? (str(ir.operational_maturity) as GovernanceStatus)
            : "healthy",
          governance_maturity: GOV.has(str(ir.governance_maturity) as GovernanceStatus)
            ? (str(ir.governance_maturity) as GovernanceStatus)
            : "healthy",
        }
      : undefined,
    board_meeting: bm
      ? {
          executive_highlights: Array.isArray(bm.executive_highlights) ? bm.executive_highlights.map((h) => str(h)) : [],
          major_accomplishments: Array.isArray(bm.major_accomplishments)
            ? bm.major_accomplishments.map((a) => {
                const row = a as Record<string, unknown>;
                return { title: str(row.title), completed_at: str(row.completed_at) };
              })
            : [],
          strategic_updates: Array.isArray(bm.strategic_updates)
            ? bm.strategic_updates.map((u) => {
                const row = u as Record<string, unknown>;
                return { title: str(row.title), status: str(row.status), health: str(row.health) };
              })
            : [],
          risks_for_discussion: Array.isArray(bm.risks_for_discussion)
            ? bm.risks_for_discussion.map((r) => {
                const row = r as Record<string, unknown>;
                return { title: str(row.title), risk_level: str(row.risk_level) };
              })
            : [],
          investment_opportunities: Array.isArray(bm.investment_opportunities)
            ? bm.investment_opportunities.map((o) => {
                const row = o as Record<string, unknown>;
                return { title: str(row.title), impact: str(row.impact) };
              })
            : [],
          recommended_decisions: Array.isArray(bm.recommended_decisions) ? bm.recommended_decisions.map((x) => str(x)) : [],
          action_items: Array.isArray(bm.action_items)
            ? bm.action_items.map((a) => {
                const row = a as Record<string, unknown>;
                return { title: str(row.title), created_at: str(row.created_at) };
              })
            : [],
        }
      : undefined,
    decision_register: Array.isArray(d.decision_register)
      ? d.decision_register.map((row) => {
          const r = row as Record<string, unknown>;
          return {
            id: str(r.id),
            action_id: str(r.action_id),
            decision: str(r.decision),
            event_type: str(r.event_type),
            outcome: str(r.outcome),
            rationale: str(r.rationale),
            implementation_status: str(r.implementation_status),
            follow_up: str(r.follow_up),
            created_at: str(r.created_at),
            performed_by: str(r.performed_by),
          };
        })
      : [],
    strategic_performance: sp
      ? Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, parseIndicator(v)]))
      : undefined,
    investor_briefing: ib
      ? {
          current_position: str(ib.current_position),
          market_opportunities: str(ib.market_opportunities),
          growth_potential: str(ib.growth_potential),
          operational_strengths: Array.isArray(ib.operational_strengths) ? ib.operational_strengths.map((s) => str(s)) : [],
          material_risks: Array.isArray(ib.material_risks) ? ib.material_risks.map((r) => str(r)) : [],
          recommended_focus: Array.isArray(ib.recommended_focus) ? ib.recommended_focus.map((f) => str(f)) : [],
          confidence_score: num(ib.confidence_score, 75),
          confidence_level: str(ib.confidence_level),
          disclaimer: str(ib.disclaimer),
        }
      : undefined,
    governance_health: gh
      ? {
          overall_score: num(gh.overall_score),
          overall_status: GOV.has(str(gh.overall_status) as GovernanceStatus)
            ? (str(gh.overall_status) as GovernanceStatus)
            : "healthy",
          decision_transparency: parseIndicator(gh.decision_transparency),
          approval_discipline: parseIndicator(gh.approval_discipline),
          risk_oversight: parseIndicator(gh.risk_oversight),
          policy_compliance: parseIndicator(gh.policy_compliance),
          executive_accountability: parseIndicator(gh.executive_accountability),
          audit_readiness: parseIndicator(gh.audit_readiness),
          board_effectiveness: parseIndicator(gh.board_effectiveness),
        }
      : undefined,
    scenarios: Array.isArray(d.scenarios)
      ? d.scenarios.map((s) => {
          const row = s as Record<string, unknown>;
          return { question: str(row.question), possibility: str(row.possibility), certainty: str(row.certainty) };
        })
      : [],
    executive_narrative: en
      ? {
          summary: str(en.summary),
          achievements: Array.isArray(en.achievements) ? en.achievements.map((a) => str(a)) : [],
          challenges: Array.isArray(en.challenges) ? en.challenges.map((c) => str(c)) : [],
          risks: str(en.risks),
          opportunities: str(en.opportunities),
          recommended_priorities: Array.isArray(en.recommended_priorities) ? en.recommended_priorities.map((p) => str(p)) : [],
          suitable_for: Array.isArray(en.suitable_for) ? en.suitable_for.map((s) => str(s)) : [],
        }
      : undefined,
    learning_insights: d.learning_insights && typeof d.learning_insights === "object"
      ? Object.fromEntries(Object.entries(d.learning_insights as Record<string, unknown>).map(([k, v]) => [k, str(v)]))
      : undefined,
    principle: str(d.principle),
  };
}

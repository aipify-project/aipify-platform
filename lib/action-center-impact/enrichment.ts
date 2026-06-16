import type { AipifyAction, RiskLevel } from "@/lib/aipify/execution/types";
import type {
  ActionImpactAnalysis,
  ActionImpactCategory,
  BusinessImpactCategoryKey,
  BusinessImpactCategoryRating,
  ConfidenceFactorKey,
  ConfidenceLevel,
  EffortUnit,
  ImpactLevel,
} from "./types";

const BUSINESS_KEYS: BusinessImpactCategoryKey[] = [
  "revenue",
  "customer_satisfaction",
  "employee_experience",
  "operational_efficiency",
  "compliance",
  "strategic_goals",
  "growth",
  "risk_reduction",
];

const CATEGORY_PROFILES: Record<
  ActionImpactCategory,
  Partial<Record<BusinessImpactCategoryKey, ImpactLevel>>
> = {
  support: {
    customer_satisfaction: "high",
    operational_efficiency: "moderate",
    employee_experience: "moderate",
    risk_reduction: "low",
  },
  automation: {
    operational_efficiency: "high",
    employee_experience: "moderate",
    strategic_goals: "moderate",
    risk_reduction: "low",
  },
  billing: {
    revenue: "high",
    compliance: "moderate",
    operational_efficiency: "moderate",
    risk_reduction: "moderate",
  },
  installation: {
    growth: "high",
    customer_satisfaction: "moderate",
    operational_efficiency: "moderate",
    strategic_goals: "moderate",
  },
  governance: {
    compliance: "high",
    risk_reduction: "high",
    strategic_goals: "moderate",
    employee_experience: "low",
  },
  customer: {
    revenue: "moderate",
    customer_satisfaction: "high",
    growth: "moderate",
    strategic_goals: "moderate",
  },
  growth_partner: {
    growth: "high",
    revenue: "moderate",
    strategic_goals: "high",
    operational_efficiency: "low",
  },
  workflow_recovery: {
    operational_efficiency: "high",
    risk_reduction: "high",
    employee_experience: "moderate",
    customer_satisfaction: "low",
  },
};

function bumpLevel(level: ImpactLevel, steps: number): ImpactLevel {
  const order: ImpactLevel[] = ["none", "low", "moderate", "high"];
  const idx = Math.min(order.length - 1, Math.max(0, order.indexOf(level) + steps));
  return order[idx];
}

function scoreToConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 90) return "very_high";
  if (score >= 75) return "high";
  if (score >= 60) return "moderate";
  if (score >= 45) return "low";
  return "very_low";
}

function effortForAction(
  risk: RiskLevel,
  category: ActionImpactCategory,
  requiresApproval: boolean
): { amount: number; unit: EffortUnit } {
  if (risk === "critical") return { amount: 1, unit: "weeks" };
  if (risk === "high") return { amount: 1, unit: "days" };
  if (category === "governance" || category === "billing") {
    return { amount: requiresApproval ? 4 : 2, unit: "hours" };
  }
  if (risk === "medium") return { amount: 2, unit: "hours" };
  if (category === "automation" || category === "workflow_recovery") {
    return { amount: 30, unit: "minutes" };
  }
  return { amount: 1, unit: "hours" };
}

function riskRationale(risk: RiskLevel, category: ActionImpactCategory): string {
  const base: Record<RiskLevel, string> = {
    low: "Limited scope, reversible workflow, and established approval controls.",
    medium: "Moderate operational touchpoints with manageable customer or process exposure.",
    high: "Broader system impact or elevated exposure requiring careful review.",
    critical: "High-stakes change with significant operational or compliance exposure.",
  };
  const categoryNote: Partial<Record<ActionImpactCategory, string>> = {
    billing: " Billing and revenue records may be affected.",
    governance: " Governance and policy outcomes require human accountability.",
    installation: " Installation changes can affect customer onboarding paths.",
  };
  return `${base[risk] ?? base.low}${categoryNote[category] ?? ""}`;
}

function strategicAlignmentScore(
  category: ActionImpactCategory,
  priority: string,
  estimatedImpact: string
): number {
  let score = 62;
  if (category === "growth_partner") score += 12;
  if (category === "governance" || category === "customer") score += 8;
  if (priority === "critical") score += 15;
  else if (priority === "high") score += 10;
  else if (priority === "medium") score += 5;
  if (estimatedImpact.trim().length > 0) score += 6;
  return Math.min(98, Math.max(45, score));
}

function valueCreationEstimate(
  category: ActionImpactCategory,
  estimatedImpact: string,
  timeSavings: string
): string {
  if (estimatedImpact.trim()) return estimatedImpact;
  const defaults: Record<ActionImpactCategory, string> = {
    support: "Reduced manual handling and faster resolution cycles",
    automation: "Operational time returned to teams for higher-value work",
    billing: "Improved billing accuracy and reduced revenue leakage risk",
    installation: "Faster time-to-value for new installations",
    governance: "Stronger accountability and audit readiness",
    customer: "Improved engagement and follow-through with customers",
    growth_partner: "Clearer partner workflows and execution velocity",
    workflow_recovery: "Restored continuity and reduced disruption cost",
  };
  return `${defaults[category]} · ${timeSavings}`;
}

function buildBusinessCategories(
  category: ActionImpactCategory,
  risk: RiskLevel
): BusinessImpactCategoryRating[] {
  const profile = CATEGORY_PROFILES[category] ?? {};
  const riskBoost = risk === "high" || risk === "critical" ? 1 : 0;
  return BUSINESS_KEYS.map((key) => {
    const base = profile[key] ?? "none";
    const positive =
      base === "none" && (key === "compliance" || key === "risk_reduction") && riskBoost
        ? "low"
        : bumpLevel(base, key === "risk_reduction" && riskBoost ? 1 : 0);
    return { key, positive_impact: positive };
  });
}

function confidenceFactors(
  analysis: ActionImpactAnalysis,
  score: number
): ConfidenceFactorKey[] {
  const factors: ConfidenceFactorKey[] = ["organizational_data"];
  const related = analysis.related_actions;
  if (related && related.similar_count >= 3) factors.push("historical_outcomes");
  if (related && related.similar_count >= 1) factors.push("similar_actions");
  factors.push("knowledge_center");
  if (analysis.approval_chain?.requires_approval_from) factors.push("human_validation");
  if (score >= 80) factors.push("historical_outcomes");
  return [...new Set(factors)];
}

function computeImpactScore(analysis: ActionImpactAnalysis): number {
  const confidence = analysis.confidence?.score ?? 70;
  const highImpacts =
    analysis.business_impact_categories?.filter((c) => c.positive_impact === "high").length ?? 0;
  const riskPenalty =
    analysis.risk_analysis?.risk_level === "critical"
      ? 25
      : analysis.risk_analysis?.risk_level === "high"
        ? 15
        : analysis.risk_analysis?.risk_level === "medium"
          ? 5
          : 0;
  return Math.round(confidence * 0.55 + highImpacts * 12 + (analysis.expected_outcome?.strategic_alignment_score ?? 60) * 0.25 - riskPenalty);
}

export function enrichActionImpactAnalysis(analysis: ActionImpactAnalysis): ActionImpactAnalysis {
  if (!analysis.found || !analysis.action) return analysis;

  const action = analysis.action;
  const category = analysis.summary?.category ?? "automation";
  const risk = analysis.risk_analysis?.risk_level ?? action.risk_level;
  const priority = analysis.summary?.priority ?? "medium";
  const benefits = analysis.business_impact?.expected_benefits ?? action.description ?? action.title;
  const timeSavings = analysis.business_impact?.estimated_time_savings ?? "6–10 hours per month";
  const confidenceScore = analysis.confidence?.score ?? 85;
  const effort = effortForAction(risk, category, action.requires_approval === true);
  const strategicScore = strategicAlignmentScore(category, priority, action.estimated_impact ?? "");
  const businessCategories = buildBusinessCategories(category, risk);
  const stakeholders = [
    analysis.business_impact?.affected_teams ?? "Operations Team",
    analysis.approval_chain?.requires_approval_from ?? "Workspace Admin",
  ].filter(Boolean);
  const uniqueStakeholders = [...new Set(stakeholders)];

  const enriched: ActionImpactAnalysis = {
    ...analysis,
    expected_outcome: {
      intended_outcome: benefits,
      recommendation_rationale: `Aipify identified this ${category.replace("_", " ")} action based on current operating signals and prepared it for your review before execution.`,
      estimated_value_creation: valueCreationEstimate(category, action.estimated_impact ?? "", timeSavings),
      strategic_alignment_score: strategicScore,
    },
    risk_analysis: {
      ...analysis.risk_analysis!,
      risk_level: risk,
      risk_rationale: riskRationale(risk, category),
      potential_side_effects:
        analysis.risk_analysis?.potential_side_effects ??
        "Minor operational adjustments during execution.",
      mitigation_strategy:
        analysis.risk_analysis?.mitigation_strategy ??
        "Monitoring enabled with full audit logging and approval gates.",
    },
    effort_estimation: {
      amount: effort.amount,
      unit: effort.unit,
      required_stakeholders: uniqueStakeholders,
      required_approvals: action.requires_approval
        ? [analysis.approval_chain?.requires_approval_from ?? "Workspace Admin"]
        : [],
      required_integrations: analysis.affected_systems ?? [],
    },
    business_impact_categories: businessCategories,
    confidence: {
      score: confidenceScore,
      level: scoreToConfidenceLevel(confidenceScore),
      reasoning_key: analysis.confidence?.reasoning_key ?? "operating_conditions",
      influence_factors: confidenceFactors(analysis, confidenceScore),
    },
    decision_support: {
      why_important_now:
        priority === "critical" || priority === "high"
          ? "Current signals indicate this action addresses an active operational or customer-facing gap."
          : "This action supports steady operational improvement while conditions remain favorable.",
      if_delayed:
        "Delay may prolong manual workload, reduce response speed, or leave related workflows unresolved.",
      if_ignored:
        "Ignoring may allow the underlying issue to persist and reduce confidence in related recommendations.",
      who_should_be_involved: uniqueStakeholders.join(" · "),
    },
    executive_summary: {
      situation: action.description || action.preview_text || action.title,
      recommendation: action.title,
      expected_benefits: benefits,
      risks: analysis.risk_analysis?.potential_side_effects ?? "Operational exposure during execution.",
      required_actions: action.requires_approval
        ? "Review impact analysis, confirm stakeholders, and approve before execution."
        : "Review impact analysis and confirm execution readiness.",
      confidence_score: confidenceScore,
      confidence_level: scoreToConfidenceLevel(confidenceScore),
    },
    human_oversight: {
      disclaimer_prefix: "based_on_available_information",
      estimate_prefix: "aipify_estimates",
      review_reminder: "review_before_execution",
    },
    impact_score: computeImpactScore({
      ...analysis,
      business_impact_categories: businessCategories,
      confidence: { score: confidenceScore, level: scoreToConfidenceLevel(confidenceScore), reasoning_key: "operating_conditions", influence_factors: [] },
      expected_outcome: {
        intended_outcome: benefits,
        recommendation_rationale: "",
        estimated_value_creation: "",
        strategic_alignment_score: strategicScore,
      },
    }),
  };

  return enriched;
}

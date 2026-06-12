export type ConfidenceLevel = "low" | "moderate" | "high";

export type DecisionType = "operational" | "strategic" | "personal";

export type DecisionDomain =
  | "support"
  | "administrative"
  | "executive"
  | "operational"
  | "personal";

export type DseSettings = {
  recommendations_enabled: boolean;
  proactivity_level: string;
  business_domains_enabled: Record<string, boolean>;
  personal_decisions_enabled: boolean;
  use_historical_data: boolean;
  presentation_style: string;
  privacy_settings: Record<string, unknown>;
};

export type DecisionRecommendation = {
  id: string;
  decision_type: DecisionType;
  domain: DecisionDomain;
  title: string;
  recommendation: string;
  reasoning: string[];
  confidence: ConfidenceLevel;
  risk_indicators: string[];
  evidence: Array<Record<string, unknown>>;
  trade_offs: string[];
  created_at: string;
};

export type DecisionHistoryEntry = {
  id: string;
  title: string;
  user_response: string;
  notes: string;
  created_at: string;
};

export type BlueprintObjective = {
  key: string;
  label: string;
  description: string;
};

export type BlueprintFrameworkQuestion = {
  key: string;
  question: string;
  purpose: string;
};

export type BlueprintDecisionType = {
  key: string;
  label: string;
  description: string;
  examples: string[];
};

export type BlueprintCompanionExample = {
  emoji: string;
  key: string;
  scenario: string;
  example: string;
};

export type BlueprintSuccessCriterion = {
  key: string;
  label: string;
  met: boolean;
  note?: string | null;
};

export type BlueprintIntegrationLink = {
  label: string;
  route: string;
  note: string;
};

export type DecisionSupportBlueprintPhase60 = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  decision_frameworks?: BlueprintFrameworkQuestion[];
  decision_types?: BlueprintDecisionType[];
  option_comparison_examples?: BlueprintCompanionExample[];
  risk_awareness?: {
    principle?: string;
    categories?: Array<{ key: string; label: string; description: string }>;
    tone?: string;
  };
  scenario_exploration?: {
    principle?: string;
    scenarios?: Array<{ key: string; label: string; description: string }>;
    simulation_note?: string;
  };
  self_love_connection?: {
    principle?: string;
    practices?: string[];
    self_love_route?: string;
    boundary_note?: string;
  };
  trust_connection?: {
    principle?: string;
    users_should_see?: string[];
    trust_action_route?: string;
    trust_action_note?: string;
  };
  dogfooding?: {
    principle?: string;
    aipify_group?: { slug: string; role: string; focus: string[] };
    unonight?: { slug: string; role: string; focus: string[] };
  };
  success_criteria?: BlueprintSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: BlueprintIntegrationLink[];
};

export type DecisionsCenterBundle = {
  has_customer: boolean;
  settings?: DseSettings;
  pending_decisions?: DecisionRecommendation[];
  business_insights?: Array<{
    id: string;
    domain: string;
    title: string;
    recommendation: string;
    confidence: ConfidenceLevel;
  }>;
  priority_opportunities?: Array<{
    id: string;
    title: string;
    risk_level: number;
    description: string;
    confidence: ConfidenceLevel;
  }>;
  risk_indicators?: string[];
  decision_history?: DecisionHistoryEntry[];
  framework?: string[];
  privacy_note?: string;
  ethical_principles?: string[];
  integrations?: Record<string, string>;
  implementation_blueprint_phase60?: DecisionSupportBlueprintPhase60;
};

export type DecisionGuidance = {
  detected: boolean;
  decision_type: DecisionType;
  domain: DecisionDomain;
  prompt: string;
  reasoning: string[];
  confidence: ConfidenceLevel;
  trade_offs?: string[];
};

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

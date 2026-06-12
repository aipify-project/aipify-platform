export type SecurityObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type ResilienceObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type AccessPrinciple = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionExample = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type TrustConnectionBlueprint = {
  principle?: string;
  organizations_should_understand?: string[];
  metadata_only?: boolean;
  transparency_note?: string;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type SecurityEngagementSummary = {
  compliance_passed?: number;
  compliance_total?: number;
  compliance_score?: number;
  pending_access_reviews?: number;
  active_policies?: number;
  mfa_required?: boolean;
  require_access_review?: boolean;
  trust_transparency_enabled?: boolean;
  resilience_plans?: number;
  open_vulnerabilities?: number;
  resilience_simulations?: number;
  privacy_note?: string;
};

export type SecurityTrustPolicy = {
  id?: string;
  policy_key?: string;
  policy_name?: string;
  access_level?: string;
  status?: string;
  description?: string;
  [key: string]: unknown;
};

export type SecurityAccessReview = {
  id?: string;
  review_type?: string;
  status?: string;
  requested_access_level?: string;
  [key: string]: unknown;
};

export type SecurityComplianceCheck = {
  id?: string;
  check_key?: string;
  check_name?: string;
  category?: string;
  passed?: boolean;
  [key: string]: unknown;
};

export type SecurityTrustEngineCard = {
  has_organization: boolean;
  compliance_score?: number;
  pending_reviews?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  blueprint_phase?: number;
  engine_phase?: string;
  route?: string;
  [key: string]: unknown;
};

export type SecurityTrustEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  privacy_note?: string;
  mission?: string;
  blueprint_philosophy?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  settings?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  policies?: SecurityTrustPolicy[];
  access_reviews?: SecurityAccessReview[];
  compliance_checks?: SecurityComplianceCheck[];
  principles?: string[];
  security_objectives?: SecurityObjective[];
  resilience_objectives?: ResilienceObjective[];
  access_principles?: AccessPrinciple[];
  companion_examples?: CompanionExample[];
  self_love_connection?: SelfLoveConnection;
  trust_connection_blueprint?: TrustConnectionBlueprint;
  dogfooding_blueprint?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  blueprint_vision_phrases?: string[];
  engagement_summary?: SecurityEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  implementation_blueprint?: Record<string, unknown>;
  [key: string]: unknown;
};

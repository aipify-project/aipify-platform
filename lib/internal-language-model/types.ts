export type AipifyFunctionKey =
  | "aipify"
  | "support_assistant"
  | "admin_assistant"
  | "knowledge_engine"
  | "business_insights_engine"
  | "continuous_improvement_engine"
  | "action_center"
  | "autonomous_execution_framework"
  | "observer_mode"
  | "assistant_mode"
  | "operator_mode"
  | "autonomous_mode"
  | "audit_log"
  | "approval_flow"
  | "safety_system";

export type FunctionVocabularyEntry = {
  key: AipifyFunctionKey;
  label: string;
  definition: string;
  preferredWording: string;
  importantExplanation?: string;
  replacementResponse?: string;
  capabilities?: string[];
  dashboardPath?: string;
};

export type AipifyFeatureGuidance = {
  detected: boolean;
  functionKey: AipifyFunctionKey;
  reply: string;
  dashboardPath?: string;
  closingPhrase?: string;
};

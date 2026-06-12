export * from "./types";
export * from "./vocabulary";
export * from "./command-vocabulary";
export * from "./nble-vocabulary";
export * from "./business-phrase-vocabulary";
export * from "./describe";
export * from "./detection";
export * from "./command-detection";
export * from "./business-phrase-detection";
export * from "./nble-detection";
export * from "./proactive-guidance-vocabulary";
export * from "./proactive-guidance";
export * from "./reminder-followup-vocabulary";
export * from "./reminder-followup";
export * from "./brand-identity-vocabulary";
export * from "./brand-identity";
export * from "./abos-vocabulary";
export * from "./abos-terminology";
export * from "./action-approval-vocabulary";
export * from "./context-intelligence-vocabulary";
export * from "./relationship-intelligence-vocabulary";

/** Canonical knowledge corpus paths (source of truth). */
export const FUNCTION_VOCABULARY_PATH =
  "aipify-core/knowledge/internal-language-model/function-vocabulary.txt";

export const USER_COMMAND_WORDING_PATH =
  "aipify-core/knowledge/internal-language-model/user-command-wording.txt";

export const NATURAL_BUSINESS_LANGUAGE_PATH =
  "aipify-core/knowledge/internal-language-model/natural-business-language-engine.txt";

export const BUSINESS_PHRASE_DATASET_PATH =
  "aipify-core/knowledge/internal-language-model/business-phrase-dataset.txt";

export const PROACTIVE_GUIDANCE_LANGUAGE_PATH =
  "aipify-core/knowledge/internal-language-model/proactive-guidance-language.txt";

export const REMINDER_FOLLOWUP_LANGUAGE_PATH =
  "aipify-core/knowledge/internal-language-model/reminder-and-followup-language.txt";

export const BRAND_IDENTITY_PERSONHOOD_PATH =
  "aipify-core/knowledge/internal-language-model/brand-identity-personhood.txt";

export const ABOS_FOUNDATION_PATH =
  "aipify-core/knowledge/internal-language-model/abos-foundation.txt";

export const ABOS_BRAND_TERMINOLOGY_PATH =
  "aipify-core/knowledge/internal-language-model/abos-brand-terminology.txt";

export const ACTION_APPROVAL_ENGINE_PATH =
  "aipify-core/knowledge/internal-language-model/action-approval-engine.txt";

export const CONTEXT_INTELLIGENCE_ENGINE_PATH =
  "aipify-core/knowledge/internal-language-model/context-intelligence-engine.txt";

export const RELATIONSHIP_INTELLIGENCE_ENGINE_PATH =
  "aipify-core/knowledge/internal-language-model/relationship-intelligence-engine.txt";

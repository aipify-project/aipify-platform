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

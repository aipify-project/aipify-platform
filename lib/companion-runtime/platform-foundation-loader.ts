import { getPlayfulMomentsSeed } from "@/lib/internal-language-model/playful-moments-bell-vocabulary";
import { getSelfLoveEngineVocabulary } from "@/lib/internal-language-model/self-love-engine-vocabulary";

/** Aipify-owned platform foundation topics — runtime-readable spec, not customer data. */
export type PlatformFoundationTopicId = "self_love_principle" | "playful_fox_exchange";

export type PlatformFoundationSourceLayer =
  | "platform_knowledge"
  | "platform_personality";

export type PlatformFoundationTopicDefinition = {
  topic_id: PlatformFoundationTopicId;
  source_layer: PlatformFoundationSourceLayer;
  /** Generic KC search phrases — no customer names or domains. */
  kc_search_phrases: readonly string[];
};

export const PLATFORM_FOUNDATION_REGISTRY: readonly PlatformFoundationTopicDefinition[] = [
  {
    topic_id: "self_love_principle",
    source_layer: "platform_knowledge",
    kc_search_phrases: [
      "what is self love in aipify",
      "understanding self love",
      "self love engine",
      "self love principle abos",
    ],
  },
  {
    topic_id: "playful_fox_exchange",
    source_layer: "platform_personality",
    kc_search_phrases: ["playful moments fox exchange", "what does the fox say"],
  },
];

export function findPlatformFoundationTopic(
  topicId: PlatformFoundationTopicId,
): PlatformFoundationTopicDefinition | null {
  return PLATFORM_FOUNDATION_REGISTRY.find((entry) => entry.topic_id === topicId) ?? null;
}

/** Runtime-readable Self Love foundation spec from approved ILM vocabulary. */
export function loadSelfLoveFoundationSpec() {
  return getSelfLoveEngineVocabulary();
}

/** Runtime-readable playful fox / bell foundation spec from approved ILM vocabulary. */
export function loadPlayfulFoxFoundationSpec() {
  return getPlayfulMomentsSeed();
}

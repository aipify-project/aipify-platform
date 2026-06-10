import type { ModelProfile } from "./types";

/**
 * Default Aipify-managed model profiles.
 * Provider keys are infrastructure identifiers — customers purchase Aipify, not a model brand.
 */
export const DEFAULT_MODEL_PROFILES: ModelProfile[] = [
  {
    profile_id: "aipify-fast",
    display_name: "Aipify Fast",
    tasks: ["support_response", "knowledge_retrieval", "presence_briefing"],
    tier: "fast",
    provider_key: "managed-fast",
  },
  {
    profile_id: "aipify-balanced",
    display_name: "Aipify Balanced",
    tasks: [
      "executive_summary",
      "recommendation",
      "email_draft",
      "installation_guidance",
      "risk_explanation",
    ],
    tier: "balanced",
    provider_key: "managed-balanced",
  },
  {
    profile_id: "aipify-reasoning",
    display_name: "Aipify Reasoning",
    tasks: ["executive_summary", "recommendation", "risk_explanation"],
    tier: "reasoning",
    provider_key: "managed-reasoning",
  },
];

export function getProfileById(
  profiles: ModelProfile[],
  profileId: string
): ModelProfile | undefined {
  return profiles.find((p) => p.profile_id === profileId);
}

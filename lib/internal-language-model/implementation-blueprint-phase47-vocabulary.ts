export const IMPLEMENTATION_BLUEPRINT_PHASE47_MISSION =
  "Build a supportive Sales Expert community where partners learn from each other, share honest success stories, and grow through voluntary mentorship — never alone in the journey.";

export const IMPLEMENTATION_BLUEPRINT_PHASE47_PHILOSOPHY =
  "Peer learning strengthens everyone. Mentorship is voluntary and respectful. Recognition educates — it does not boast. Community dialogue is constructive, professional, and trust-building.";

export const IMPLEMENTATION_BLUEPRINT_PHASE47_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) grows when Sales Experts support each other — humans decide, Aipify informs and connects. Community amplifies capability without replacing individual judgment.";

export const IMPLEMENTATION_BLUEPRINT_PHASE47_OBJECTIVE_KEYS = [
  "peer_learning",
  "mentorship",
  "best_practices",
  "recognition",
  "problem_solving",
  "belonging",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE47_STORY_CATEGORY_KEYS = [
  "first_customer",
  "outreach_ideas",
  "challenges_overcome",
  "implementation_wins",
  "renewals",
  "best_practices",
  "mentorship",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE47_RECOGNITION_BADGE_KEYS = [
  "mentor",
  "community_contributor",
  "knowledge_champion",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE47_HUB_CHANNEL_KEYS = [
  "discussions",
  "success_stories",
  "qa",
  "inspiration",
  "best_practices",
] as const;

export function getImplementationBlueprintPhase47Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE47_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE47_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE47_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE47_OBJECTIVE_KEYS,
    storyCategoryKeys: IMPLEMENTATION_BLUEPRINT_PHASE47_STORY_CATEGORY_KEYS,
    recognitionBadgeKeys: IMPLEMENTATION_BLUEPRINT_PHASE47_RECOGNITION_BADGE_KEYS,
    hubChannelKeys: IMPLEMENTATION_BLUEPRINT_PHASE47_HUB_CHANNEL_KEYS,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 47 — Sales Community & Mentorship Engine",
    communityTab: "community",
    orgCommunityRoute: "/app/community",
    orgCommunityPhase: "Phase 89",
    coachEnablementPhase: 45,
    certificationPhase: 46,
    performanceRecognitionPhase: 41,
    academyRoute: "/app/learning-training-engine",
    academyPhase: 94,
    partnerSuccessRoute: "/app/partner-success-engine",
    partnerSuccessPhase: "A.73",
    gratitudeRoute: "/app/gratitude-recognition-engine",
    gratitudePhase: "A.89",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    distinctionNote:
      "Distinct from /app/community Phase 89 org-wide knowledge — Phase 47 is Sales Expert peer community within /app/sales-expert-engine Community tab.",
    mentorshipVoluntary: true,
    storySummaryMaxChars: 500,
  };
}

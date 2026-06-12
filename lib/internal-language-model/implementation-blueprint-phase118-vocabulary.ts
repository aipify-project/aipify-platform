export const IMPLEMENTATION_BLUEPRINT_PHASE118_MISSION =
  "Help organizations use their influence responsibly — aligning activities with values, measuring social contributions, and creating lasting positive impact.";

export const IMPLEMENTATION_BLUEPRINT_PHASE118_PHILOSOPHY =
  "Organizations have influence; technology amplifies it. Use influence responsibly. Purpose = action not marketing. People First. Stewardship through responsibility. Success includes people — not only profits.";

export const IMPLEMENTATION_BLUEPRINT_PHASE118_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Social Impact & Purpose Engine orchestrates Purpose Center visibility and social impact initiative stewardship. Purpose & Values A.82 and Impact Engine A.85 remain authoritative. Aipify informs and prepares; humans decide purpose and commitments.";

export const IMPLEMENTATION_BLUEPRINT_PHASE118_VISION =
  "Our organization's purpose is visible in what we do — not only what we say. Social impact is stewardship, not marketing.";

export const IMPLEMENTATION_BLUEPRINT_PHASE118_OBJECTIVE_KEYS = [
  "align_values",
  "measure_contributions",
  "responsible_leadership",
  "community_engagement",
  "employee_wellbeing",
  "sustainable_growth",
  "ethical_innovation",
  "lasting_impact",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_INITIATIVE_TYPES = [
  "volunteer_programs",
  "employee_support",
  "knowledge_sharing_projects",
  "community_partnerships",
  "education_sponsorships",
  "mentorship_initiatives",
  "accessibility_improvements",
  "wellbeing_campaigns",
  "local_impact_projects",
  "global_contribution_programs",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_WELLBEING_AREAS = [
  "workload_balance",
  "learning_sustainability",
  "psychological_safety",
  "recognition_practices",
  "healthy_boundaries",
  "professional_growth",
  "manager_support",
  "community_participation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_ALIGNMENT_DIMENSIONS = [
  "declared_values",
  "leadership_behaviors",
  "operational_practices",
  "companion_usage",
  "governance_structures",
  "customer_experiences",
  "growth_partner_relationships",
  "community_activities",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_IMPACT_INDICATORS = [
  "participation_rates",
  "volunteer_contributions",
  "knowledge_sharing",
  "employee_engagement",
  "training_access",
  "community_reach",
  "purpose_initiative_progress",
  "recognition_activities",
  "wellbeing_program_adoption",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_COMPANION_EXAMPLES = [
  "🦉 Three purpose initiatives are active — shall Aipify prepare a calm progress summary for your review?",
  "🌹 Wellbeing program adoption is growing — would celebrating one team milestone before planning the next initiative feel wise?",
  "🔔 A community partnership opportunity aligns with your stated purpose — Community hub cross-link available when you are ready.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_LIMITATIONS = [
  "No performative scoring or ESG gamification",
  "No moral judgment or shaming automation",
  "No PII in social impact tables",
  "Do not duplicate Purpose & Values or Impact Engine RPCs",
  "No manipulative recommendations that pressure participation",
  "Companions encourage support — never replace human care",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE118_VISION_PHRASES = [
  "Purpose is action not marketing.",
  "Humans define purpose; Companions support action.",
  "Reflection not perfection in alignment.",
  "Thoughtful impact tracking — not performative.",
  "Organizations that care for people build stronger futures.",
] as const;

export function getImplementationBlueprintPhase118Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE118_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE118_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE118_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE118_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE118_OBJECTIVE_KEYS,
    initiativeTypes: IMPLEMENTATION_BLUEPRINT_PHASE118_INITIATIVE_TYPES,
    wellbeingAreas: IMPLEMENTATION_BLUEPRINT_PHASE118_WELLBEING_AREAS,
    alignmentDimensions: IMPLEMENTATION_BLUEPRINT_PHASE118_ALIGNMENT_DIMENSIONS,
    impactIndicators: IMPLEMENTATION_BLUEPRINT_PHASE118_IMPACT_INDICATORS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE118_COMPANION_EXAMPLES,
    limitations: IMPLEMENTATION_BLUEPRINT_PHASE118_LIMITATIONS,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE118_VISION_PHRASES,
    engineRoute: "/app/social-impact-purpose-engine",
    enginePhase: "Repo Phase 118",
    blueprintPhase: "Phase 118 — Social Impact & Purpose Engine",
    purposeValuesRoute: "/app/purpose-values-engine",
    purposeValuesDistinction: "Purpose & Values A.82 + Blueprint 64 — organizational values alignment cross-link only",
    impactEngineRoute: "/app/impact-engine",
    impactEngineDistinction: "Impact Engine A.85 — outcome measurement cross-link only",
    platformImpactRoute: "/platform/impact",
    platformImpactDistinction: "Platform Anonymised Impact — marketing proof, NOT tenant social impact",
    selfLoveRoute: "/app/self-love-engine",
    communityRoute: "/app/community",
    growthPartnerRoute: "/app/growth-partner-operations",
    helperPrefix: "_sipbp118_*",
    engineHelperPrefix: "_sipe_*",
  };
}

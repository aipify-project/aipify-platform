export const IMPLEMENTATION_BLUEPRINT_PHASE123_MISSION =
  "Support boards with clarity, transparency, and preparedness — strengthen oversight without replacing governance or influencing director independence.";

export const IMPLEMENTATION_BLUEPRINT_PHASE123_PHILOSOPHY =
  "Wisdom before speed. Stewardship over urgency. Boards navigate uncertainty with discipline — Aipify informs and prepares; directors remain accountable and independent.";

export const IMPLEMENTATION_BLUEPRINT_PHASE123_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Board & Governance Companion strengthens responsible stewardship. Metadata only — financial summaries are scaffold framing, never raw records.";

export const IMPLEMENTATION_BLUEPRINT_PHASE123_OBJECTIVE_KEYS = [
  "preparedness",
  "strategic_visibility",
  "oversight",
  "governance_quality",
  "continuity",
  "informed_discussions",
  "emerging_risks",
  "responsible_leadership",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE123_COMPANION_EXAMPLES = [
  "🦉 Several governance policies interconnect — shall Aipify summarize dependency context for board review when directors are ready?",
  "🌹 Stewardship milestones progressed since the last meeting — recognition without pressure to accelerate every agenda item.",
  "🔔 Emerging governance review gaps deserve board awareness — preparedness framing, not alarm.",
  "📈 Key strategic developments since the last board meeting — metadata summaries prepared for director review.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE123_LIMITATIONS = [
  "Never vote on behalf of directors",
  "Never override director decisions",
  "Never suppress material information",
  "Never influence director independence",
  "Never create conflicts of interest",
  "Never replace human judgment",
] as const;

export function getImplementationBlueprintPhase123Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE123_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE123_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE123_ABOS_PRINCIPLE,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE123_OBJECTIVE_KEYS,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE123_COMPANION_EXAMPLES,
    limitations: IMPLEMENTATION_BLUEPRINT_PHASE123_LIMITATIONS,
    engineRoute: "/app/governance-policy-engine",
    enginePhase: "Phase A.14",
    blueprintPhase: "Phase 123 — Board & Governance Companion Engine",
    era: "Enterprise Intelligence Era (121–130)",
    phase67Distinction:
      "ABOS Blueprint Phase 67 (_bgcbp_*) established board preparation scaffolds — Phase 123 (_bgbp123_*) deepens board intelligence on the same route",
    executiveIntelligenceCrossLink: "/app/executive-intelligence — Phase 121",
    strategicForesightCrossLink: "/app/strategic-foresight-engine — Phase 122",
    ecosystemGovernanceCrossLink: "/app/ecosystem-governance — Phase 119",
    selfLoveRoute: "/app/self-love-engine",
    governancePhrase: "Good governance often involves patience and thoughtful dialogue.",
    privacyNote:
      "Metadata only — financial summaries scaffold framing, no raw records, no director evaluation.",
  };
}

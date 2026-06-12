export const IMPLEMENTATION_BLUEPRINT_PHASE86_MISSION =
  "Reduce operational friction by orchestrating repetitive, well-defined, approved workflows.";

export const IMPLEMENTATION_BLUEPRINT_PHASE86_PHILOSOPHY =
  "Autonomy without safeguards = risk; human judgment without support = burden.";

export const IMPLEMENTATION_BLUEPRINT_PHASE86_ABOS_PRINCIPLE =
  "Automation amplifies human potential — Aipify removes friction while preserving dignity, creativity, and accountability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE86_VISION =
  "Aipify quietly handled everything that did not require our full attention.";

export const IMPLEMENTATION_BLUEPRINT_PHASE86_OBJECTIVE_KEYS = [
  "friction_reduction",
  "approval_aware_execution",
  "cross_module_orchestration",
  "explainable_automation",
  "operational_consistency",
  "human_judgment_preservation",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE86_AUTONOMY_LEVELS = [
  "observe",
  "assist",
  "execute",
  "orchestrate",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE86_HUMAN_APPROVAL_CATEGORIES = [
  "financial",
  "termination",
  "strategic",
  "sensitive_comms",
  "legal",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE86_COMPANION_EXAMPLES = [
  "🦉 Support cases with the same root cause appeared three times — a triage workflow could reduce repeat effort. Shall I prepare the template for your review?",
  "🌹 Sales Expert onboarding tasks are queued — the welcome sequence is ready when you approve the next step.",
  "🔔 Stripe payment received — Fiken invoice draft awaits finance approval. Here is what changed and why.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE86_SAFETY_AVOID_KEYS = [
  "hidden_automation",
  "irreversible_autonomous",
  "unexplained_decisions",
  "removing_accountability",
] as const;

export function getImplementationBlueprintPhase86Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE86_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE86_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE86_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE86_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE86_OBJECTIVE_KEYS,
    autonomyLevels: IMPLEMENTATION_BLUEPRINT_PHASE86_AUTONOMY_LEVELS,
    humanApprovalCategories: IMPLEMENTATION_BLUEPRINT_PHASE86_HUMAN_APPROVAL_CATEGORIES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE86_COMPANION_EXAMPLES,
    safetyAvoidKeys: IMPLEMENTATION_BLUEPRINT_PHASE86_SAFETY_AVOID_KEYS,
    engineRoute: "/app/workflow-orchestration-engine",
    enginePhase: "Phase A.42 + Blueprint Phase 40",
    blueprintPhase: "Phase 86 — Autonomous Operations Orchestration Engine",
    customerLifecycleRoute: "/app/customer-lifecycle",
    customerLifecycleDistinction:
      "Customer Lifecycle & Success Orchestration repo Phase 86 — customer journey, not operational orchestration",
    legacyEngineRoute: "/app/legacy-engine",
    legacyEngineDistinction: "Legacy Engine Phase A.86 — organizational wisdom storytelling",
    longTermStewardshipDistinction:
      "Blueprint Phase 83 Long-Term Stewardship extends A.86 Legacy — not operations orchestration",
    actionCenterRoute: "/app/action-center",
    actionCenterDistinction: "AEF Phase 44 — controlled business action execution",
    approvalsRoute: "/app/approvals",
    approvalsDistinction: "Trust & Action Phase 30 — risk levels 0–4",
    actionHubRoute: "/app/actions",
    actionHubDistinction: "Action Hub Phase 64 — operational action queue",
    operationsRoute: "/app/operations",
    operationsDistinction: "Autonomous Operations Center repo Phase 79 — observes and recommends",
    humanOversightRoute: "/app/human-oversight-engine",
    delegatedTrustRoute: "/app/enterprise-readiness-engine",
    selfLoveRoute: "/app/self-love-engine",
    helperPrefix: "_aoobp86_*",
    phase40HelperPrefix: "_awobp_* (Blueprint Phase 40) — do not collide",
    engineHelperPrefix: "_woe_* (Phase A.42) — do not collide",
  };
}

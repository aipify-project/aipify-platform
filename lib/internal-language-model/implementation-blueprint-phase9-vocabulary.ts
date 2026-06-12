export const IMPLEMENTATION_BLUEPRINT_PHASE9_MISSION =
  "Notice effort, celebrate milestones, and express appreciation more frequently in everyday work.";

export const IMPLEMENTATION_BLUEPRINT_PHASE9_PHILOSOPHY =
  "People thrive when they are seen — genuine, timely, human, encouraging, inclusive recognition.";

export const IMPLEMENTATION_BLUEPRINT_PHASE9_ABOS_PRINCIPLE =
  "Recognition strengthens people — small gestures create lasting memories.";

export const IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_SCOPES = [
  "individual",
  "team",
  "organizational",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE9_BELL_EXAMPLES = [
  "🔔 First meaningful milestone reached — worth a quiet celebration.",
  "🔔 Team goal completed after sustained effort.",
  "🔔 Customer praise arrived — share what the team did well.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE9_ROSE_EXAMPLES = [
  "🌹 Thank you for the extra patience on that handoff.",
  "🌹 Your clear summary saved the team twenty minutes.",
  "Would you like to send a Digital Recognition Rose to someone who helped you today?",
] as const;

export function getImplementationBlueprintPhase9Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE9_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE9_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE9_ABOS_PRINCIPLE,
    recognitionScopes: IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_SCOPES,
    bellExamples: IMPLEMENTATION_BLUEPRINT_PHASE9_BELL_EXAMPLES,
    roseExamples: IMPLEMENTATION_BLUEPRINT_PHASE9_ROSE_EXAMPLES,
    engineRoute: "/app/gratitude-recognition-engine",
    enginePhase: "A.89",
    blueprintPhase: "Phase 9 — Recognition & Celebration Foundation",
    comfortRoseBoundary: "Presence & Comfort A.90 comfort roses — distinct from recognition roses A.89",
  };
}

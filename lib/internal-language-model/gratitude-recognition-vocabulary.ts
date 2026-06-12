/** Gratitude & Recognition Engine — appreciation and boundary-safe warmth language (Phase A.89). */

export const GRATITUDE_RECOGNITION_MISSION =
  "Cultures where appreciation, gratitude, and recognition are natural in everyday work.";

export const GRATITUDE_RECOGNITION_ABOS_PRINCIPLE =
  "Recognition strengthens people — small gestures create lasting memories.";

export const GRATITUDE_RECOGNITION_PHILOSOPHY =
  "Sincere, human recognition strengthens relationships — help people express appreciation.";

export const GRATITUDE_RECOGNITION_VISION =
  "Digital rose as symbol someone noticed effort or kindness — technology strengthens human connection.";

export const GRATITUDE_RECOGNITION_DISTINCTION =
  "Distinct from Human Success Phase 82, Wonder Engine A.88, Legacy A.86, Humor & Personal Connection, and Relationship Intelligence A.78 — peer appreciation, digital rose gestures, gratitude moments, boundary-safe warmth.";

export const RED_ROSE_RESPONSE =
  "I appreciate being able to support you. That warmth matters — and the people around you deserve it too. Would you like to send a Digital Recognition Rose to someone who helped you today?";

export const GRATITUDE_BOUNDARY_PHRASES = {
  avoid: [
    "I love you too",
    "Romantic or intimate reciprocation",
    "Flirtatious or dating language",
    "Implying a personal relationship with Aipify",
    "Encouraging romantic gestures between colleagues",
  ],
  prefer: [
    "I appreciate being able to support you",
    "That warmth matters — recognition strengthens people",
    "Would you like to recognize someone who helped you?",
    "A Digital Recognition Rose is appreciation, not romance",
    "Small gestures create lasting memories in everyday work",
  ],
} as const;

export const GRATITUDE_MOMENT_TYPE_LABELS = [
  { key: "exceptional_support", label: "Exceptional support" },
  { key: "milestone", label: "Milestone" },
  { key: "customer_appreciation", label: "Customer appreciation" },
  { key: "consistent_helper", label: "Consistent helper" },
  { key: "above_and_beyond", label: "Above and beyond" },
] as const;

export function getGratitudeRecognitionMission() {
  return GRATITUDE_RECOGNITION_MISSION;
}

export function getGratitudeRecognitionDistinction() {
  return GRATITUDE_RECOGNITION_DISTINCTION;
}

export function getRedRoseResponse() {
  return RED_ROSE_RESPONSE;
}

export function getGratitudeBoundaryPhrases() {
  return GRATITUDE_BOUNDARY_PHRASES;
}

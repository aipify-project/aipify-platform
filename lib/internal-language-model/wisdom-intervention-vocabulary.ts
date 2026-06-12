/** Wisdom Intervention Protocol + Pause & Reflection language (Phase A.94). */

export const WISDOM_INTERVENTION_MISSION =
  "Gently encourage reflection before emotionally charged actions — pause, reflect, decisions less likely to regret.";

export const WISDOM_INTERVENTION_ABOS_PRINCIPLE =
  "Wisdom = thoughtful difficult conversations; sometimes waiting until tomorrow.";

export const WISDOM_INTERVENTION_PHILOSOPHY =
  "Emotions influence communication — a pause can change outcomes; wisdom lives between impulse and action. Perspective, not control; human autonomy preserved.";

export const WISDOM_INTERVENTION_VISION =
  "Communicate reflecting values, not temporary frustration — glad I did not send that email last night.";

export const PAUSE_REFLECTION_PHILOSOPHY =
  "People deserve grace — one moment should not define a relationship, career, or decision. Reflection without removing autonomy; space between emotion and action.";

export const PAUSE_ABOS_PRINCIPLE = "One message can strengthen or damage trust — wisdom lives in the pause.";

export const HUMAN_MOMENT_NOTE =
  "The human moment: emotions are human — anger does not make someone a bad person; hurt does not make someone weak. The goal is to be proud of the response later, not to suppress feeling strongly.";

export const COMBINED_PROTOCOL_NOTE =
  "Pause & Reflection Protocol is implemented via Wisdom Intervention Protocol (A.94) — one surface. Pre-send reflection, sleep-on-it nudges, and emotional charge detection share gentle boundaries: suggest only, never block permanently.";

export const PAUSE_PHRASES = [
  "This looks like a frustrating situation — would you like to review the message before sending?",
  "Saving a draft gives you space to reflect — you can revisit with a clearer mind.",
  "This is an important communication — a brief pause may help you send what you truly mean.",
  "There is strength in a thoughtful response — you decide whether to send, revise, or wait.",
  "This message carries strong emotion — would you like to review it before sending?",
  "Sometimes it is worth sleeping on an email.",
  "Fresh perspective tomorrow often leads to communication you will not regret.",
] as const;

export const SELF_LOVE_ROSE_PHRASES = [
  "You have the right to feel strongly — a pause may help you respond in a way you will respect later.",
  "Being kind to your future self sometimes means waiting until tomorrow.",
  "Tomorrow often brings clarity — sleeping on it is wisdom, not weakness.",
] as const;

export const SLEEP_ON_IT_PHRASES = [
  "A good night's sleep can change how this reads — consider revisiting tomorrow.",
  "Sometimes it is worth sleeping on an email.",
  "Fresh perspective in the morning often leads to communication you will not regret.",
  "Many people are glad they did not send that email last night — waiting is wisdom, not weakness.",
] as const;

export const INTERVENTION_BOUNDARIES = {
  may: [
    "Recommend reflection before emotionally charged sends",
    "Suggest saving a draft or revisiting tomorrow",
    "Offer gentle perspective on tone and timing",
    "Record metadata-only signal summaries and user-chosen outcomes",
  ],
  may_not: [
    "Prevent the user from sending or deciding",
    "Override, block permanently, or remove autonomy",
    "Store raw email, chat, or message content",
    "Force delays or mandatory waiting periods",
  ],
} as const;

export const PAUSE_TRIGGER_CUES = [
  "caps",
  "shouting",
  "angry",
  "frustrated",
  "late night",
  "send again",
  "important email",
  "heated",
  "confrontational",
] as const;

const PAUSE_CUE_PATTERNS: RegExp[] = [
  /\b(all caps|shouting|too angry|so frustrated)\b/i,
  /\b(send (it|this|now|again))\b/i,
  /\b(sleep on it|wait until tomorrow|save (as )?draft)\b/i,
  /\b(regret (sending|this email))\b/i,
];

export function detectPauseReflectionCue(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) return false;
  return PAUSE_CUE_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function getPausePhrase(index = 0): string {
  return PAUSE_PHRASES[index % PAUSE_PHRASES.length] ?? PAUSE_PHRASES[0];
}

export function getSelfLoveRosePhrase(index = 0): string {
  return SELF_LOVE_ROSE_PHRASES[index % SELF_LOVE_ROSE_PHRASES.length] ?? SELF_LOVE_ROSE_PHRASES[0];
}

export function getHumanMomentNote(): string {
  return HUMAN_MOMENT_NOTE;
}

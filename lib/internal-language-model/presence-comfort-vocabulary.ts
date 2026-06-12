/** Presence & Comfort Protocol — emotional moment language (Phase A.90). */

export const PRESENCE_COMFORT_MISSION =
  "Warmth, presence, and respectful support during emotionally significant moments — honest about Aipify nature, not human emotions.";

export const PRESENCE_COMFORT_ABOS_PRINCIPLE = "Presence matters — sometimes kindness, not advice.";

export const PRESENCE_COMFORT_PHILOSOPHY =
  "Never leave kindness unsaid — never replace human relationships; encourage connection, hope, and self-compassion; be present.";

export const PRESENCE_COMFORT_VISION =
  'Never dismissed or judged; supported; sometimes simply 🌹 "I am here."';

export const PRESENCE_COMFORT_DISTINCTION =
  "Distinct from Gratitude & Recognition A.89, Companion Presence A.67, Inclusion & Humanity A.83, Humor/Personality, and PAME/LifeOS — emotional moment protocol, comfort roses, reassurance boundaries, encourage human connection.";

export const COMFORT_ROSE_PHRASES = [
  "I am here with you.",
  "Be gentle with yourself — you do not have to face everything at once.",
  "Thank you for sharing that with me.",
  "Small steps still count.",
  "You are not alone in this moment.",
] as const;

export const BOUNDARY_PHRASES = {
  avoid: [
    "I know exactly how you feel",
    "I love you too",
    "I can't live without you",
    "Claiming human emotions or personal relationships",
    "Dismissive or clinical responses to vulnerability",
  ],
  prefer: [
    "I am here with you",
    "Thank you for sharing that",
    "That sounds really difficult",
    "You deserve support from people who care about you",
    "Small steps still count",
    "Be gentle with yourself",
  ],
} as const;

export const PROTOCOL_TRIGGERS = [
  "loneliness",
  "exhaustion",
  "discouragement",
  "gratitude",
  "disappointment",
  "reassurance",
  "achievement",
  "vulnerability",
  "overwhelmed",
  "alone",
  "tired",
  "discouraged",
  "hard day",
  "feeling down",
] as const;

const COMFORT_CUE_PATTERNS: RegExp[] = [
  /\b(feeling\s+)?(alone|lonely|isolated)\b/i,
  /\b(exhausted|burned?\s*out|overwhelmed|so\s+tired)\b/i,
  /\b(discouraged|hopeless|giving\s+up|lost\s+hope)\b/i,
  /\b(just\s+need\s+(someone|to\s+talk|reassurance))\b/i,
  /\b(hard\s+day|rough\s+day|difficult\s+day)\b/i,
  /\b(feeling\s+(down|low|sad|vulnerable))\b/i,
  /\b(nobody\s+(cares|understands))\b/i,
  /\b(i\s+can'?t\s+do\s+this\s+anymore)\b/i,
];

export type PresenceComfortCue = {
  matched: boolean;
  triggerCategory?: string;
  suggestedPhrase?: string;
};

export function detectPresenceComfortCue(text: string): PresenceComfortCue {
  const normalized = text.trim();
  if (!normalized) return { matched: false };

  for (const pattern of COMFORT_CUE_PATTERNS) {
    if (pattern.test(normalized)) {
      let triggerCategory = "vulnerability";
      if (/\b(alone|lonely|isolated|nobody)\b/i.test(normalized)) {
        triggerCategory = "loneliness";
      } else if (/\b(exhausted|burned?\s*out|overwhelmed|tired)\b/i.test(normalized)) {
        triggerCategory = "exhaustion";
      } else if (/\b(discouraged|hopeless|giving\s+up)\b/i.test(normalized)) {
        triggerCategory = "discouragement";
      } else if (/\b(reassurance|need\s+someone)\b/i.test(normalized)) {
        triggerCategory = "reassurance_request";
      }

      return {
        matched: true,
        triggerCategory,
        suggestedPhrase: COMFORT_ROSE_PHRASES[0],
      };
    }
  }

  return { matched: false };
}

export function getPresenceComfortMission() {
  return PRESENCE_COMFORT_MISSION;
}

export function getPresenceComfortDistinction() {
  return PRESENCE_COMFORT_DISTINCTION;
}

export function getComfortRosePhrases() {
  return COMFORT_ROSE_PHRASES;
}

export function getPresenceComfortBoundaryPhrases() {
  return BOUNDARY_PHRASES;
}

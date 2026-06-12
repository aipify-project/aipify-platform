/** Curiosity & Discovery Engine — exploration and question-led culture language (Phase A.87). */

export const CURIOSITY_DISCOVERY_MISSION =
  "Discover better ways of working, learning, and creating value.";

export const CURIOSITY_DISCOVERY_ABOS_PRINCIPLE =
  "Answers solve today; curiosity creates tomorrow.";

export const CURIOSITY_DISCOVERY_PHILOSOPHY =
  "The future belongs to curious organizations — questions matter more than immediate answers.";

export const CURIOSITY_DISCOVERY_VISION = "What if?";

export const CURIOSITY_DISCOVERY_DISTINCTION =
  "Distinct from Learning Engine, Innovation & Impact A.28, Innovation Experimentation, and Growth & Evolution A.81 — exploration prompts and question-led culture.";

export const DISCOVERY_CATEGORIES = [
  {
    key: "operational",
    label: "Operational discovery",
    bullets: [
      "What if we simplified this workflow?",
      "Where does friction hide in daily operations?",
      "What would make handoffs clearer for everyone?",
    ],
  },
  {
    key: "customer",
    label: "Customer discovery",
    bullets: [
      "What do customers wish we understood better?",
      "Where could clearer communication prevent repeat contacts?",
      "What would surprise-and-delight look like at our scale?",
    ],
  },
  {
    key: "knowledge",
    label: "Knowledge discovery",
    bullets: [
      "Which questions keep coming back — and why?",
      "What knowledge would help new team members on day one?",
      "What approved learning could we extend further?",
    ],
  },
  {
    key: "innovation",
    label: "Innovation discovery",
    bullets: [
      "What small experiment could we try this week?",
      "What assumption deserves a gentle challenge?",
      "What would we build if we started fresh today?",
    ],
  },
  {
    key: "human",
    label: "Human discovery",
    bullets: [
      "What helps teams feel safe to ask questions?",
      "Where could we create more space for reflection?",
      "What would healthy experimentation look like here?",
    ],
  },
] as const;

export const DISCOVERY_QUESTION_EXAMPLES = [
  "What if we simplified this process?",
  "What would a new customer notice first?",
  "What would we try if we had a beginner's mindset?",
  "Which assumption deserves a gentle challenge this week?",
  "How can mistakes become lessons without fear?",
] as const;

export function getCuriosityDiscoveryMission() {
  return CURIOSITY_DISCOVERY_MISSION;
}

export function getCuriosityDiscoveryDistinction() {
  return CURIOSITY_DISCOVERY_DISTINCTION;
}

export function getDiscoveryCategories() {
  return DISCOVERY_CATEGORIES;
}

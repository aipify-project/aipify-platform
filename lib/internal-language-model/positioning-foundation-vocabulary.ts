/** ABOS Positioning Foundation — plain-language digital coworker messaging. */

export const POSITIONING_MISSION =
  "Simple, human communication — understand Aipify in seconds.";

export const POSITIONING_PHILOSOPHY =
  "People buy outcomes: time, clarity, support, confidence, experiences, and sustainable growth.";

export const POSITIONING_SIMPLE_EXPLANATION =
  "Aipify is a digital coworker that helps your business stay organized, respond faster, and work smarter.";

export const POSITIONING_WHAT_IS = [
  "A digital coworker for business — support, knowledge, task follow-up, and daily operations.",
  "Install-first operational intelligence inside the systems your team already uses.",
  "Efficiency with humanity — a capable colleague, not a generic bot.",
] as const;

export const POSITIONING_WHAT_IS_NOT = [
  "Not a chatbot",
  "Not just automation",
  "Not replacing people",
  "Not another dashboard customers must log into daily",
] as const;

export const POSITIONING_WHAT_DOES = [
  {
    emoji: "💬",
    key: "support",
    label: "Support",
    description: "Respond faster with triage, drafts, and escalation paths.",
  },
  {
    emoji: "📚",
    key: "knowledge",
    label: "Knowledge",
    description: "Approved answers and procedures your team trusts.",
  },
  {
    emoji: "✅",
    key: "follow_up",
    label: "Follow-up",
    description: "Tasks and reminders so work does not slip.",
  },
  {
    emoji: "⚙️",
    key: "operations",
    label: "Operations",
    description: "Daily admin coordination inside existing systems.",
  },
  {
    emoji: "📄",
    key: "deliverables",
    label: "Deliverables",
    description: "Reports, summaries, and business-ready documents.",
  },
  {
    emoji: "🔐",
    key: "trust",
    label: "Trust",
    description: "Approvals, audit logs, and human control on sensitive work.",
  },
  {
    emoji: "📊",
    key: "clarity",
    label: "Clarity",
    description: "Insights and recommendations with explainable reasoning.",
  },
] as const;

export const POSITIONING_DIFFERENCE =
  "Efficiency + humanity — prepared work and faster responses with calm tone, respect, and transparent limits.";

export const POSITIONING_THREE_STEPS = [
  {
    key: "install",
    label: "Install",
    description: "Connect Aipify to your business systems in minutes.",
  },
  {
    key: "teach",
    label: "Teach",
    description: "Share knowledge, workflows, and how your organization operates.",
  },
  {
    key: "work_alongside",
    label: "Work alongside",
    description: "Aipify assists inside daily work; your team approves what matters.",
  },
] as const;

export const POSITIONING_COMMON_QUESTIONS = [
  {
    key: "chatbot",
    question: "Is Aipify just a chatbot?",
    answer:
      "No. Aipify is a digital coworker — an Aipify Business Operating System (ABOS) for support, knowledge, follow-up, operations, deliverables, trust, and clarity. Chat is one surface; the product is operational assistance with human control.",
  },
  {
    key: "replace_employees",
    question: "Will Aipify replace our employees?",
    answer:
      "No. Aipify augments people. It prepares drafts, organizes knowledge, and handles repeatable work within approved boundaries. Your team makes important decisions.",
  },
  {
    key: "what_does_it_do",
    question: "What does Aipify actually do?",
    answer:
      "Aipify helps your business stay organized, respond faster, and work smarter — through support, knowledge, follow-up, operations, deliverables, trust controls, and explainable clarity.",
  },
] as const;

export const POSITIONING_WEBSITE_MESSAGING = {
  headline: "Meet Aipify – Your Digital Coworker",
  subheadline:
    "Aipify helps your business stay organized, respond faster, and work smarter — inside the systems your team already uses.",
  simpleExplanation: POSITIONING_SIMPLE_EXPLANATION,
  notChatbot: "Not a chatbot. A calm digital coworker with human control built in.",
  ctaPrimary: "Request early access",
  ctaSecondary: "See how it works",
} as const;

export const POSITIONING_UNDER_THE_HOOD = [
  "ABOS six pillars — Knowledge, Assistance, Automation, Intelligence, Governance, Operations",
  "Install Engine — install-first discovery and delivery",
  "Trust & Action — approval tiers, audit, emergency stop",
  "Learning Engine — assisted improvement from approved metadata",
  "Business DNA & Knowledge Center — tenant-trusted answers",
  "Self Love — platform self-maintenance and gentle recovery",
  "Multi-tenant architecture and model-agnostic intelligence",
] as const;

export const POSITIONING_SELF_LOVE_NOTE =
  "Self Love (no ™) helps Aipify maintain operational wellbeing so it can better support your business — calm, non-alarmist guidance with human approval for sensitive recovery.";

export const POSITIONING_ABOS_PRINCIPLE =
  "Efficiency with humanity — technology augments people; it does not replace judgment, dignity, or trust.";

export const POSITIONING_VISION =
  "Establish Aipify Business Operating System (ABOS) as the trusted operational layer — introduced as a digital coworker — helping organizations work smarter, respond faster, and grow sustainably.";

export function getPositioningFoundationVocabulary() {
  return {
    mission: POSITIONING_MISSION,
    philosophy: POSITIONING_PHILOSOPHY,
    simpleExplanation: POSITIONING_SIMPLE_EXPLANATION,
    whatIs: POSITIONING_WHAT_IS,
    whatIsNot: POSITIONING_WHAT_IS_NOT,
    whatDoes: POSITIONING_WHAT_DOES,
    difference: POSITIONING_DIFFERENCE,
    threeSteps: POSITIONING_THREE_STEPS,
    commonQuestions: POSITIONING_COMMON_QUESTIONS,
    websiteMessaging: POSITIONING_WEBSITE_MESSAGING,
    underTheHood: POSITIONING_UNDER_THE_HOOD,
    selfLoveNote: POSITIONING_SELF_LOVE_NOTE,
    abosPrinciple: POSITIONING_ABOS_PRINCIPLE,
    vision: POSITIONING_VISION,
  };
}

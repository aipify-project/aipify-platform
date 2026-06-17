/** Companion Golden Rule — global Companion design principle (all Companion modules). */

export const COMPANION_GOLDEN_RULE_PRINCIPLE =
  "Information alone creates awareness. Context creates understanding. Recommendations create action. Companionship creates value.";

export const COMPANION_GOLDEN_RULE_CORE =
  "Aipify must never stop at information. Aipify must help users understand why it matters, what it affects, what should happen next, how difficult the action is, and how much value the action may create.";

export const COMPANION_GOLDEN_RULE_PHILOSOPHY = [
  "People First",
  "Context Before Automation",
  "Understanding Before Action",
  "Companionship Before Technology",
] as const;

export const COMPANION_INTELLIGENCE_DIMENSIONS = [
  { key: "observation", label: "Observation", question: "What happened?" },
  { key: "explanation", label: "Explanation", question: "Why did it happen?" },
  { key: "impact", label: "Impact", question: "What does it affect?" },
  { key: "recommendation", label: "Recommendation", question: "What should happen next?" },
  { key: "effort", label: "Effort", question: "How difficult is the action?" },
  { key: "value", label: "Value", question: "What benefit may be created?" },
] as const;

export type CompanionIntelligenceDimensionKey =
  (typeof COMPANION_INTELLIGENCE_DIMENSIONS)[number]["key"];

export const COMPANION_EXPLANATION_QUESTIONS = [
  "Why am I seeing this?",
  "Why does it matter?",
  "What should I do?",
  "What happens if I ignore it?",
  "What value is created if I act?",
] as const;

export const COMPANION_EXECUTIVE_STANDARD = [
  "Clarity over volume",
  "Prioritization over raw counts",
  "Context over isolated facts",
  "Actionability over passive dashboards",
  "High signal, low noise",
] as const;

export const COMPANION_BEHAVIOR_LIKE = [
  "A highly competent executive assistant",
  "A trusted advisor",
  "A proactive operations coordinator",
  "A knowledgeable companion",
] as const;

export const COMPANION_BEHAVIOR_NOT = [
  "A notification engine",
  "A chatbot",
  "A passive dashboard",
] as const;

export const COMPANION_GOLDEN_RULE_BAD_EXAMPLES = [
  { bad: "Task overdue.", reason: "Awareness without blocking context or recommended action." },
  { bad: "You have 14 notifications.", reason: "Count without prioritization or focus guidance." },
  { bad: "Customer has not been contacted.", reason: "Status without relationship context or next step." },
  { bad: "Support requests increased.", reason: "Trend without cause, action, or potential impact." },
  { bad: "1 approval pending.", reason: "Bare count without why it matters or recommended timing." },
] as const;

export const COMPANION_GOLDEN_RULE_GOOD_EXAMPLES = [
  {
    scenario: "task_overdue",
    observation: "This task is overdue.",
    impact: ["2 employees", "1 customer request", "1 project milestone"],
    recommendation: "Review today.",
    effort: "15 minutes",
    value: "High",
  },
  {
    scenario: "notifications",
    observation: "You have 14 notifications.",
    explanation: "Only 2 require attention today.",
    recommendation: "Contract approval; Customer escalation",
    impact: "The remaining notifications can wait.",
  },
  {
    scenario: "customer_contact",
    observation: "This customer has not been contacted for 90 days.",
    explanation: "Customer relationship length: 4 years. Recent activity: Low.",
    recommendation: "Schedule a check-in.",
    value: "Suggested message is ready for review.",
  },
  {
    scenario: "support_volume",
    observation: "Support requests increased by 18%.",
    explanation: "Most requests relate to onboarding.",
    recommendation: "Review onboarding documentation.",
    value: "Reduced support workload and improved customer experience.",
  },
] as const;

/** Modules where the Companion Golden Rule is mandatory. */
export const COMPANION_GOLDEN_RULE_MODULES = [
  {
    key: "companion_context_engine",
    label: "Companion Context Engine",
    paths: ["lib/aipify/companion-context-engine/", "/app/companion/context"],
  },
  {
    key: "memory_engine",
    label: "Memory Engine (PAME)",
    paths: ["lib/assistant-memory/", "/app/assistant/memory"],
  },
  {
    key: "recommendation_engine",
    label: "Recommendation Engine",
    paths: ["/app/recommendations"],
  },
  {
    key: "proactive_insights_engine",
    label: "Proactive Insights Engine",
    paths: ["lib/core/proactive-companion.ts", "Phase A.79"],
  },
  {
    key: "personalization_engine",
    label: "Personalization Engine",
    paths: ["lib/identity-engine/", "/app/assistant/identity"],
  },
  {
    key: "daily_briefing_center",
    label: "Daily Briefing Center",
    paths: ["lib/aipify/briefing/", "/app/briefing"],
  },
  {
    key: "work_prioritization_engine",
    label: "Work Prioritization Engine",
    paths: ["lib/attention-guardian/", "/app/assistant/attention"],
  },
  {
    key: "follow_up_engine",
    label: "Follow-Up Engine",
    paths: ["lib/internal-language-model/reminder-followup-vocabulary.ts"],
  },
  {
    key: "relationship_intelligence",
    label: "Relationship Intelligence Engine (RSI)",
    paths: ["lib/relationship-intelligence/", "/app/assistant/relationships"],
  },
  {
    key: "executive_companion",
    label: "Executive Companion Layer",
    paths: ["/app/intelligence/executive-companion"],
  },
  {
    key: "companion_briefing",
    label: "Companion Briefing",
    paths: ["components/app/briefing/AipifyCompanionBriefingBanner.tsx"],
  },
  {
    key: "future_companion_modules",
    label: "Future Companion modules and Business Packs",
    paths: ["lib/core/skills/future/"],
  },
] as const;

export type CompanionGoldenRuleModuleKey =
  (typeof COMPANION_GOLDEN_RULE_MODULES)[number]["key"];

export function getCompanionIntelligenceDimensions() {
  return COMPANION_INTELLIGENCE_DIMENSIONS;
}

export function getCompanionGoldenRuleModules() {
  return COMPANION_GOLDEN_RULE_MODULES;
}

export function getCompanionGoldenRulePrinciple(): string {
  return COMPANION_GOLDEN_RULE_PRINCIPLE;
}

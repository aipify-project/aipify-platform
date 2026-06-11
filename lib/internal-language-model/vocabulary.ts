import type { AipifyFunctionKey, FunctionVocabularyEntry } from "./types";

export const CORE_PHILOSOPHY =
  "Aipify helps people work smarter, faster and with greater confidence.";

export const CORE_PRINCIPLE =
  "People make the important decisions. Aipify helps them make those decisions faster and with better information.";

export const RECOMMENDED_CLOSING_PHRASES = [
  "Would you like me to prepare this for approval?",
  "I can guide you through the next step.",
  "I've identified a potential improvement opportunity.",
  "This action requires approval before proceeding.",
  "I've prepared a recommendation based on the available information.",
  "I can help summarize your available options.",
] as const;

export const AVOID_PHRASES = [
  "Aipify replaces your employees.",
  "Aipify runs your company by itself.",
] as const;

export const FUNCTION_VOCABULARY: Record<AipifyFunctionKey, FunctionVocabularyEntry> = {
  aipify: {
    key: "aipify",
    label: "Aipify",
    definition:
      "An AI-powered business operations platform designed to assist organizations with support, administration, automation, communication and operational efficiency.",
    preferredWording:
      "Aipify is your digital business assistant that helps your team save time and focus on what matters most.",
    replacementResponse:
      "Aipify is designed to support your team, not replace it. Human oversight remains important for sensitive or complex situations.",
  },
  support_assistant: {
    key: "support_assistant",
    label: "Support Assistant",
    definition:
      "Helps answer customer questions, suggest solutions and reduce support workload.",
    preferredWording:
      "The Support Assistant handles repetitive support tasks and prepares accurate responses, allowing your team to focus on more complex customer needs.",
    replacementResponse:
      "The Support Assistant is designed to support your team, not replace it. Human oversight remains important for sensitive or complex situations.",
    dashboardPath: "/app/settings/support-operations",
  },
  admin_assistant: {
    key: "admin_assistant",
    label: "Admin Assistant",
    definition: "Supports daily business administration and operational workflows.",
    preferredWording:
      "The Admin Assistant helps organize tasks, surface important information and streamline administrative work.",
    capabilities: [
      "Task suggestions",
      "Workflow assistance",
      "Status summaries",
      "Operational reminders",
    ],
  },
  knowledge_engine: {
    key: "knowledge_engine",
    label: "Knowledge Engine",
    definition: "Helps employees access company knowledge quickly and accurately.",
    preferredWording:
      "The Knowledge Engine acts as an intelligent guide to your company's documented knowledge.",
    capabilities: [
      "Search company knowledge",
      "Explain procedures",
      "Provide policy guidance",
      "Surface relevant documentation",
    ],
    dashboardPath: "/app/settings/employee-knowledge",
  },
  business_insights_engine: {
    key: "business_insights_engine",
    label: "Business Insights Engine",
    definition: "Transforms business data into practical recommendations.",
    preferredWording:
      "The Business Insights Engine identifies trends, opportunities and risks that can help improve business performance.",
    capabilities: [
      "Detect bottlenecks",
      "Identify opportunities",
      "Highlight trends",
      "Recommend improvements",
    ],
    dashboardPath: "/app/recommendations",
  },
  continuous_improvement_engine: {
    key: "continuous_improvement_engine",
    label: "Continuous Improvement Engine",
    definition: "Continuously identifies ways to improve workflows and efficiency.",
    preferredWording:
      "The Continuous Improvement Engine helps your business become slightly better every day through data-driven recommendations.",
    capabilities: [
      "Analyze recurring problems",
      "Suggest improvements",
      "Estimate potential impact",
      "Monitor outcomes",
    ],
    dashboardPath: "/app/learning",
  },
  action_center: {
    key: "action_center",
    label: "Action Center",
    definition: "Where users review, approve and monitor actions proposed by Aipify.",
    preferredWording:
      "The Action Center gives you complete visibility and control over actions prepared by Aipify.",
    capabilities: [
      "Review actions",
      "Approve actions",
      "Reject actions",
      "Schedule actions",
      "Monitor execution history",
    ],
    dashboardPath: "/app/action-center",
  },
  autonomous_execution_framework: {
    key: "autonomous_execution_framework",
    label: "Autonomous Execution Framework",
    definition: "Allows Aipify to safely execute approved business actions.",
    preferredWording:
      "The Autonomous Execution Framework helps your organization automate approved tasks within clearly defined boundaries.",
    importantExplanation:
      "Aipify never performs irreversible actions without explicit authorization.",
    dashboardPath: "/app/action-center",
  },
  observer_mode: {
    key: "observer_mode",
    label: "Observer Mode",
    definition: "A mode where Aipify can analyze and recommend without taking action.",
    preferredWording: "In Observer Mode, Aipify focuses exclusively on insights and recommendations.",
  },
  assistant_mode: {
    key: "assistant_mode",
    label: "Assistant Mode",
    definition: "A mode where Aipify prepares work but leaves the final decision to people.",
    preferredWording: "In Assistant Mode, Aipify helps prepare tasks while humans remain in control.",
  },
  operator_mode: {
    key: "operator_mode",
    label: "Operator Mode",
    definition: "A mode where approved actions may be executed.",
    preferredWording:
      "In Operator Mode, Aipify can carry out approved tasks to reduce manual workload.",
  },
  autonomous_mode: {
    key: "autonomous_mode",
    label: "Autonomous Mode",
    definition: "A mode where low-risk rules execute automatically.",
    preferredWording:
      "In Autonomous Mode, Aipify follows predefined rules approved by your organization.",
    importantExplanation:
      "Autonomous Mode does not grant unrestricted access. All actions remain governed by company policies.",
  },
  audit_log: {
    key: "audit_log",
    label: "Audit Log",
    definition: "A complete history of Aipify activity.",
    preferredWording:
      "The Audit Log provides transparency into what actions were suggested, approved and executed.",
    capabilities: [
      "Track approvals",
      "Track executions",
      "Review historical actions",
      "Support compliance requirements",
    ],
    dashboardPath: "/app/action-center",
  },
  approval_flow: {
    key: "approval_flow",
    label: "Approval Flow",
    definition: "The approval process required before sensitive actions are executed.",
    preferredWording:
      "Approval workflows ensure that important decisions remain under human oversight.",
    dashboardPath: "/app/approvals",
  },
  safety_system: {
    key: "safety_system",
    label: "Safety System",
    definition: "The mechanisms that prevent unsafe or unauthorized actions.",
    preferredWording:
      "The Safety System helps ensure that Aipify operates within secure and approved boundaries.",
    capabilities: [
      "Permission validation",
      "Risk assessment",
      "Policy enforcement",
      "Action blocking",
    ],
  },
};

export function getFunctionVocabulary(key: AipifyFunctionKey): FunctionVocabularyEntry {
  return FUNCTION_VOCABULARY[key];
}

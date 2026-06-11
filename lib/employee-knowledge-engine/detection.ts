import type { EmployeeKnowledgeGuidance, KnowledgeCategory } from "./types";

const EMPLOYEE_KNOWLEDGE_PATTERNS: Array<{
  pattern: RegExp;
  category: KnowledgeCategory;
}> = [
  { pattern: /\bhow do (?:i|we)\b/i, category: "operational_procedures" },
  { pattern: /\bhow should (?:i|we)\b/i, category: "support_procedures" },
  { pattern: /\bwhat is our\b/i, category: "policies" },
  { pattern: /\bwho approves\b/i, category: "operational_procedures" },
  { pattern: /\bwhere can i find\b/i, category: "policies" },
  { pattern: /\bprocess a refund\b/i, category: "support_procedures" },
  { pattern: /\bverify (?:a |new )?member\b/i, category: "support_procedures" },
  { pattern: /\bmoderat(?:e|ion)\b/i, category: "support_procedures" },
  { pattern: /\bmarketplace\b/i, category: "support_procedures" },
  { pattern: /\bgift card\b/i, category: "product_knowledge" },
  { pattern: /\bgdpr\b/i, category: "policies" },
  { pattern: /\bcancellation policy\b/i, category: "policies" },
  { pattern: /\bonboarding\b/i, category: "training_content" },
  { pattern: /\binternal (?:guide|procedure|policy)\b/i, category: "operational_procedures" },
  { pattern: /\bcompany (?:policy|procedure)\b/i, category: "policies" },
];

function buildPrompt(category: KnowledgeCategory): string {
  if (category === "support_procedures") {
    return "I can guide you through support procedures from approved documentation — with step-by-step guidance when available. Open Employee Knowledge for full coverage, or ask your specific question here.";
  }
  if (category === "policies") {
    return "I can help you find official policies and compliance guidance. Employee Knowledge surfaces approved documentation only — you retain judgment on how to apply it.";
  }
  if (category === "training_content") {
    return "I can point you to onboarding and training resources for your role. Check Employee Knowledge for your learning path and required modules.";
  }
  return "I can help you navigate internal procedures from approved organizational knowledge. Ask a specific question, or open Employee Knowledge for search and step-by-step guidance.";
}

export function detectEmployeeKnowledgeIntent(message: string): EmployeeKnowledgeGuidance | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const match = EMPLOYEE_KNOWLEDGE_PATTERNS.find(({ pattern }) => pattern.test(trimmed));
  if (!match) return null;

  return {
    detected: true,
    category: match.category,
    prompt: buildPrompt(match.category),
    dashboard_path: "/app/settings/employee-knowledge",
  };
}

import type { DecisionGuidance } from "./types";

const DECISION_PATTERNS: Array<{ pattern: RegExp; type: DecisionGuidance["decision_type"]; domain: DecisionGuidance["domain"] }> = [
  { pattern: /\bwhat should i focus on\b/i, type: "operational", domain: "operational" },
  { pattern: /\bwhere should i start\b/i, type: "operational", domain: "operational" },
  { pattern: /\bi don'?t know where to start\b/i, type: "operational", domain: "operational" },
  { pattern: /\bwhich (?:of these )?options?\b/i, type: "strategic", domain: "executive" },
  { pattern: /\bwhich (?:ticket|case|request)s?\b/i, type: "operational", domain: "support" },
  { pattern: /\bshould i (?:accept|take|join)\b.*\bmeeting\b/i, type: "personal", domain: "operational" },
  { pattern: /\bshould i accept\b/i, type: "personal", domain: "operational" },
  { pattern: /\bhelp me decide\b/i, type: "operational", domain: "operational" },
  { pattern: /\bwhat should i prioritize\b/i, type: "operational", domain: "executive" },
  { pattern: /\bwhich initiative\b/i, type: "strategic", domain: "executive" },
  { pattern: /\bescalat(e|ion)\b/i, type: "operational", domain: "support" },
  { pattern: /\bwhich (?:task|item)s? (?:first|next)\b/i, type: "operational", domain: "administrative" },
];

function buildPrompt(
  type: DecisionGuidance["decision_type"],
  domain: DecisionGuidance["domain"],
  isMeeting: boolean
): string {
  if (isMeeting) {
    return "Before accepting, consider: Does this protect your priorities or add fragmentation? I'll outline trade-offs — you decide. Check your Decisions dashboard for meeting-load context.";
  }
  if (domain === "support") {
    return "I can help you think through support priorities — I'll highlight trade-offs and evidence, but you make the final call. Open your Decisions dashboard for pending recommendations, or tell me what's competing for attention.";
  }
  if (type === "strategic") {
    return "Let's clarify your options against your strategic goals. I'll present observations and trade-offs — you retain final authority. Your Decisions dashboard has business insights and risk indicators.";
  }
  return "I can help you see options more clearly — not decide for you. Your Decisions dashboard gathers context from support, goals, and calendar. What are you choosing between?";
}

function buildReasoning(domain: DecisionGuidance["domain"]): string[] {
  const base = [
    "Aipify presents information and trade-offs — you make the final decision",
    "Recommendations reflect available context, not certainty",
  ];
  if (domain === "support") {
    return [
      ...base,
      "Support prioritization strengthens response times and customer outcomes",
      "High-risk pending items may warrant escalation review",
    ];
  }
  if (domain === "executive") {
    return [
      ...base,
      "Initiatives align best when capacity is visible",
      "Lower-priority work can be deferred without losing control",
    ];
  }
  return [
    ...base,
    "Aligning actions with stated goals reduces decision fatigue",
    "Personal guidance complements — never replaces — business focus",
  ];
}

function inferConfidence(message: string): DecisionGuidance["confidence"] {
  if (/\b(urgent|immediately|critical|asap)\b/i.test(message)) return "high";
  if (/\b(maybe|not sure|unsure|idk)\b/i.test(message)) return "low";
  return "moderate";
}

export function detectDecisionIntent(message: string): DecisionGuidance | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const match = DECISION_PATTERNS.find(({ pattern }) => pattern.test(trimmed));
  if (!match) return null;

  const isMeeting = /\bmeeting\b/i.test(trimmed);
  const tradeOffs = isMeeting
    ? ["Accept for relationship value vs. protect focus time", "Short-term availability vs. long-term priorities"]
    : match.domain === "support"
      ? ["Respond immediately vs. batch for efficiency", "Escalate vs. resolve at current level"]
      : ["Act now vs. defer for capacity", "Breadth of coverage vs. depth on priorities"];

  return {
    detected: true,
    decision_type: match.type,
    domain: isMeeting ? "operational" : match.domain,
    prompt: buildPrompt(match.type, match.domain, isMeeting),
    reasoning: buildReasoning(match.domain),
    confidence: inferConfidence(trimmed),
    trade_offs: tradeOffs,
  };
}

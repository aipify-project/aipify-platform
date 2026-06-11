const AIPIFY_KNOWLEDGE_PATTERNS = [
  /\bwhat is aipify\b/i,
  /\bwhat does aipify do\b/i,
  /\bhow does aipify work\b/i,
  /\bhow (?:do|can) i (?:set up|setup|configure) aipify\b/i,
  /\bcan aipify\b/i,
  /\bdoes aipify\b/i,
  /\baipify (?:support|automations?|governance|approvals?|insights?|predictions?)\b/i,
  /\b(?:emergency stop|approval request|knowledge (?:center|gap))\b/i,
  /\bhow (?:do|can) i (?:pause|disable|enable) automations?\b/i,
  /\bhow (?:do|can) i connect (?:shopify|supabase|resend|vercel|calendar)\b/i,
  /\b(?:gdpr|privacy|data retention)\b.*\baipify\b/i,
  /\baipify\b.*(?:gdpr|privacy|data retention)\b/i,
  /\bwhat (?:are|is) (?:aipify )?insights?\b/i,
  /\bwhat (?:are|is) (?:aipify )?predictions?\b/i,
  /\bwhy did aipify suggest\b/i,
];

export function isAipifyKnowledgeQuestion(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;
  if (/\baipify\b/i.test(trimmed)) return true;
  return AIPIFY_KNOWLEDGE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

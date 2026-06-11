import { SUPPORT_CATEGORIES } from "./dimensions";

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number];

const PATTERNS: Array<{ pattern: RegExp; category: SupportCategory }> = [
  { pattern: /\b(order|tracking|delivery|shipped|where is my)\b/i, category: "delivery" },
  { pattern: /\b(refund|return|money back)\b/i, category: "refund" },
  { pattern: /\b(login|password|sign in|account)\b/i, category: "account" },
  { pattern: /\b(payment|invoice|billing|charge)\b/i, category: "payment" },
  { pattern: /\b(subscription|plan|cancel)\b/i, category: "subscription" },
  { pattern: /\b(book|appointment|reschedule)\b/i, category: "booking" },
  { pattern: /\b(verify|verification|approved)\b/i, category: "verification" },
  { pattern: /\b(complaint|angry|unacceptable|lawyer|legal)\b/i, category: "complaint" },
  { pattern: /\b(error|bug|not working|technical)\b/i, category: "technical" },
];

export function classifySupportEmail(subject: string, body: string): SupportCategory {
  const text = `${subject} ${body}`;
  const match = PATTERNS.find(({ pattern }) => pattern.test(text));
  return match?.category ?? "general";
}

export function detectEscalationTriggers(subject: string, body: string): string | null {
  const text = `${subject} ${body}`.toLowerCase();
  if (/\b(lawyer|legal|chargeback|sue)\b/.test(text)) return "Legal or payment dispute";
  if (/\b(angry|unacceptable|terrible)\b/.test(text)) return "Customer sentiment";
  if (/\b(password|credit card|ssn)\b/.test(text)) return "Sensitive data";
  return null;
}

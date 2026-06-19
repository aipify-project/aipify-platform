/** Phase 576 — Organizational memory graph intent detection for Companion routing. */

const MEMORY_GRAPH_PATTERNS = [
  /\bmemory graph\b/i,
  /\borganizational context\b/i,
  /\bwhat should i know before (?:this )?meeting\b/i,
  /\bshow related (?:decisions|projects|dependencies)\b/i,
  /\bshow customer history\b/i,
  /\bcontext briefing\b/i,
  /\brelationship (?:map|intelligence)\b/i,
  /\bentity (?:registry|history)\b/i,
  /\bhow (?:everything|entities) connect\b/i,
  /\bdependency mapping\b/i,
];

export function detectMemoryGraphIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return MEMORY_GRAPH_PATTERNS.some((pattern) => pattern.test(text));
}

export const MEMORY_GRAPH_ROUTE = "/app/memory-graph";

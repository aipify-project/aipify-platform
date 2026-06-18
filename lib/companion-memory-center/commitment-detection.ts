/**
 * Phase 433 — client-side commitment phrase hints (server RPC is authoritative).
 * Extends PAME memory intent patterns for companion memory center.
 */

export const COMMITMENT_PHRASE_PATTERNS: RegExp[] = [
  /\bremember\b/i,
  /\bremind me\b/i,
  /\bdon'?t let me forget\b/i,
  /\bdo not let me forget\b/i,
  /\bfollow up on\b/i,
  /\bfollow up with\b/i,
  /\bi will\b/i,
  /\bi need to\b/i,
  /\bneed to\b/i,
  /\bdid you ever\b/i,
  /\bhave you heard back\b/i,
  /\bsend that email\b/i,
  /\bcontact.*last (monday|tuesday|wednesday|thursday|friday|week|month)\b/i,
  /\bstill unpaid\b/i,
  /\bplanned to contact\b/i,
];

export function hasCommitmentPhrase(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return COMMITMENT_PHRASE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

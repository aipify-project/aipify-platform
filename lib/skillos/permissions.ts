/** Least-privilege permission examples (Phase 22 §6–7). */

export const SKILL_PERMISSION_EXAMPLES = [
  "support.read",
  "support.write",
  "email.draft",
  "email.send",
  "analytics.read",
  "commerce.read",
  "commerce.write",
] as const;

export type SkillPermissionKey = (typeof SKILL_PERMISSION_EXAMPLES)[number];

export function isKnownPermissionKey(key: string): boolean {
  return /^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/.test(key);
}

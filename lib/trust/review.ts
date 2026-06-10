/** Security review checklist before new skill release (Phase 19 §22). */
export const SKILL_SECURITY_REVIEW_CHECKS = [
  "permission_scope",
  "data_minimization",
  "approval_requirements",
  "tenant_isolation",
  "audit_logging",
] as const;

export type SkillSecurityReviewCheck =
  (typeof SKILL_SECURITY_REVIEW_CHECKS)[number];

export function buildSkillSecurityReview(
  results: Partial<Record<SkillSecurityReviewCheck, boolean>>
): { passed: boolean; failed: SkillSecurityReviewCheck[] } {
  const failed = SKILL_SECURITY_REVIEW_CHECKS.filter(
    (check) => results[check] !== true
  );
  return { passed: failed.length === 0, failed };
}

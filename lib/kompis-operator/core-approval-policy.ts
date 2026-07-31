/** CORE.APPROVAL policy for Kompis website tools (Trust & Action / Approval Center). */

import type { KompisOperatorToolKey } from "./tools-registry";

export const KOMPIS_CORE_APPROVAL_TOOL_KEYS = [
  "website_publish_approved_draft",
  "website_publish_rollback",
] as const satisfies readonly KompisOperatorToolKey[];

export type KompisCoreApprovalToolKey = (typeof KOMPIS_CORE_APPROVAL_TOOL_KEYS)[number];

export function toolRequiresCoreApproval(toolKey: string): toolKey is KompisCoreApprovalToolKey {
  return (KOMPIS_CORE_APPROVAL_TOOL_KEYS as readonly string[]).includes(toolKey);
}

export type KompisCoreApprovalScope = {
  website_id?: string | null;
  path?: string | null;
  candidate_id?: string | null;
  target_version_id?: string | null;
  expected_current_version_id?: string | null;
  locale?: string | null;
  reason?: string | null;
  action_checksum?: string | null;
  idempotency_key?: string | null;
};

export function buildKompisCoreApprovalScope(
  partial: KompisCoreApprovalScope,
): Record<string, string> {
  const scope: Record<string, string> = {};
  if (partial.website_id) scope.website_id = partial.website_id;
  if (partial.path) scope.path = partial.path;
  if (partial.candidate_id) scope.candidate_id = partial.candidate_id;
  if (partial.target_version_id) scope.target_version_id = partial.target_version_id;
  if (partial.expected_current_version_id) {
    scope.expected_current_version_id = partial.expected_current_version_id;
  }
  if (partial.locale) scope.locale = partial.locale;
  if (partial.reason) scope.reason = partial.reason;
  if (partial.action_checksum) scope.action_checksum = partial.action_checksum;
  if (partial.idempotency_key) scope.idempotency_key = partial.idempotency_key;
  return scope;
}

/**
 * Certification & Achievement Engine helpers (Phase A.37).
 * Authoritative enforcement lives in Supabase RPCs (_cae_*).
 * Extends Learning & Training Engine (A.36).
 */

import { formatEuropeanDate } from "./date";

export const CERTIFICATE_STATUSES = ["active", "expired", "revoked"] as const;
export const EXPIRATION_POLICIES = ["none", "fixed_days", "annual_renewal"] as const;

export type CertificateStatus = (typeof CERTIFICATE_STATUSES)[number];
export type ExpirationPolicy = (typeof EXPIRATION_POLICIES)[number];

export const CERTIFICATE_TEMPLATE_PLACEHOLDERS = {
  userName: "[USER NAME]",
  certificationName: "[CERTIFICATION NAME]",
} as const;

type CertificationRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function canViewCertifications(role: string): boolean {
  return ["owner", "administrator", "manager", "support_agent", "viewer"].includes(role);
}

export function canIssueCertifications(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function canRevokeCertifications(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canExportCertifications(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export function canManageCertifications(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function buildCertificateTemplateText(
  userName: string,
  certificationName: string,
  issuedAt?: string | null,
  expiresAt?: string | null
): string {
  const issued = issuedAt ? formatEuropeanDate(issuedAt) : formatEuropeanDate(new Date());
  const expiry = expiresAt ? formatEuropeanDate(expiresAt) : "—";

  return [
    "Aipify Certification",
    "",
    `This certifies that ${userName} has successfully completed ${certificationName}.`,
    "",
    `Issued: ${issued}`,
    expiresAt ? `Valid until: ${expiry}` : "No expiration",
    "",
    "Metadata only — no PII stored in certificate export payload beyond display name.",
  ].join("\n");
}

export async function getCertificationAchievementEngineDashboard(
  supabase: CertificationRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_certification_achievement_engine_dashboard");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function issueUserCertification(
  supabase: CertificationRpcClient,
  userId: string,
  certificationDefinitionId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("issue_user_certification", {
    p_user_id: userId,
    p_certification_definition_id: certificationDefinitionId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function revokeUserCertification(
  supabase: CertificationRpcClient,
  userCertificationId: string,
  reason?: string | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("revoke_user_certification", {
    p_user_certification_id: userCertificationId,
    p_reason: reason ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function exportUserCertificate(
  supabase: CertificationRpcClient,
  userCertificationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("export_user_certificate", {
    p_user_certification_id: userCertificationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createCertificationAchievementAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

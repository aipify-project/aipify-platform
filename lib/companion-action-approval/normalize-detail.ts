import type { CustomerApproval } from "@/lib/app/customer-app/types";

export type NormalizedApprovalDetail = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  riskLevel: string;
  createdAt: string | null;
  expiresAt: string | null;
  actionName: string;
  source: string;
  returnToKompis: boolean;
  skillName: string | null;
  confidenceScore: number | null;
  approverRoleRequired: string | null;
  websitePath: string | null;
  websiteLocale: string | null;
  candidateId: string | null;
  expectedCurrentVersionId: string | null;
  currentVersionId: string | null;
  actionChecksum: string | null;
  auditReference: string | null;
  toolKey: string | null;
  runId: string | null;
  stepId: string | null;
  bindingComplete: boolean;
  isWebsiteKompisPublish: boolean;
  isWebsiteKompisRollback: boolean;
  isActionablePending: boolean;
  decisionAllowed: boolean;
  decisionBlockReason: "missing" | "not_pending" | "incomplete_scope" | "emergency" | null;
};

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeApprovalDetail(
  item: CustomerApproval | null | undefined,
  options: { emergencyActive?: boolean } = {},
): NormalizedApprovalDetail | null {
  if (!item || typeof item !== "object") return null;

  const id = asString(item.id);
  if (!id) return null;

  const actionName = asString(item.action_name)?.toLowerCase() ?? "";
  const status = asString(item.status)?.toLowerCase() ?? "pending";
  const source = asString(item.source)?.toLowerCase() ?? "";
  const returnToKompis = asBool(item.return_to_kompis) || source === "kompis";
  const isWebsiteKompisPublish = actionName === "website_publish_approved_draft";
  const isWebsiteKompisRollback = actionName === "website_publish_rollback";
  const isWebsiteAction = isWebsiteKompisPublish || isWebsiteKompisRollback;

  const websitePath = asString(item.website_path);
  const websiteLocale = asString(item.website_locale);
  const candidateId = asString(item.candidate_id);
  const expectedCurrentVersionId = asString(item.expected_current_version_id);
  const currentVersionId = asString(item.current_version_id);
  const actionChecksum = asString(item.action_checksum);
  const toolKey = asString(item.tool_key) ?? (isWebsiteAction ? actionName : null);
  const runId = asString(item.run_id) ?? asString(item.resource_id);
  const stepId = asString(item.step_id);

  const bindingComplete = isWebsiteAction
    ? asBool(item.binding_complete, false) ||
      Boolean(
        websitePath &&
          websiteLocale &&
          candidateId &&
          expectedCurrentVersionId &&
          actionChecksum &&
          runId,
      )
    : true;

  const isActionablePending = ["pending", "awaiting_approval"].includes(status);
  const emergencyActive = options.emergencyActive === true;

  let decisionBlockReason: NormalizedApprovalDetail["decisionBlockReason"] = null;
  if (!isActionablePending) decisionBlockReason = "not_pending";
  else if (emergencyActive) decisionBlockReason = "emergency";
  else if (isWebsiteAction && !bindingComplete) decisionBlockReason = "incomplete_scope";

  return {
    id,
    title: asString(item.title) ?? (actionName || "Approval"),
    description: asString(item.description) ?? "",
    category: asString(item.category) ?? "action",
    status,
    riskLevel: asString(item.risk_level) ?? String(item.risk_level ?? ""),
    createdAt: asString(item.created_at),
    expiresAt: asString(item.expires_at),
    actionName,
    source,
    returnToKompis,
    skillName: asString(item.skill_name),
    confidenceScore:
      typeof item.confidence_score === "number" && Number.isFinite(item.confidence_score)
        ? item.confidence_score
        : null,
    approverRoleRequired: asString(item.approver_role_required),
    websitePath,
    websiteLocale,
    candidateId,
    expectedCurrentVersionId,
    currentVersionId,
    actionChecksum,
    auditReference: asString(item.audit_reference) ?? id.slice(0, 8),
    toolKey,
    runId,
    stepId,
    bindingComplete,
    isWebsiteKompisPublish,
    isWebsiteKompisRollback,
    isActionablePending,
    decisionAllowed: decisionBlockReason == null,
    decisionBlockReason,
  };
}

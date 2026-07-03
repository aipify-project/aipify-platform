import type { CoreHumanApprovalRequest, HumanApprovalReceiptLabels, HumanApprovalReceiptModel } from "./types";

const FORBIDDEN_RECEIPT_TOKENS = [
  "payload_hash",
  "scope_json",
  "scope_fingerprint",
  "idempotency_key",
  "secret",
  "token",
  "password",
  "api_key",
];

export function buildHumanApprovalReceiptModel(
  request: CoreHumanApprovalRequest,
  confirmationHeading: string,
  labels: HumanApprovalReceiptLabels,
): HumanApprovalReceiptModel {
  const validity =
    request.access_mode === "ongoing" ? labels.ongoing : labels.oneTime;

  return {
    confirmationHeading,
    approvedBy: request.approved_by_display ?? labels.notAvailable,
    approverRole: request.approver_role_snapshot ?? labels.notAvailable,
    approvedAt: request.approved_at ?? request.updated_at ?? labels.notAvailable,
    action: request.title || request.action_key || labels.notAvailable,
    scope: request.scope_summary || labels.notAvailable,
    target: request.target_environment || labels.notAvailable,
    validity,
    expiresAt: request.expires_at,
    auditId: request.latest_audit_id ?? labels.notAvailable,
    correlationId: request.correlation_id,
    status: request.status,
    executionResult: request.execution_result,
    unchanged: request.unchanged_summary || null,
  };
}

export function formatHumanApprovalReceiptPlainText(
  model: HumanApprovalReceiptModel,
  labels: HumanApprovalReceiptLabels,
): string {
  const lines = [
    model.confirmationHeading,
    `${labels.approvedBy}: ${model.approvedBy}`,
    `${labels.approverRole}: ${model.approverRole}`,
    `${labels.approvedAt}: ${model.approvedAt}`,
    `${labels.action}: ${model.action}`,
    `${labels.scope}: ${model.scope}`,
    `${labels.target}: ${model.target}`,
    `${labels.validity}: ${model.validity}`,
  ];

  if (model.expiresAt) {
    lines.push(`${labels.expiresAt}: ${model.expiresAt}`);
  }

  lines.push(
    `${labels.auditId}: ${model.auditId}`,
    `${labels.correlationId}: ${model.correlationId}`,
    `${labels.status}: ${model.status}`,
  );

  if (model.executionResult) {
    lines.push(`${labels.executionResult}: ${model.executionResult}`);
  }

  if (model.unchanged) {
    lines.push(`${labels.unchanged}: ${model.unchanged}`);
  }

  return lines.join("\n");
}

export function receiptPlainTextExcludesSensitiveFields(text: string): boolean {
  const lower = text.toLowerCase();
  return !FORBIDDEN_RECEIPT_TOKENS.some((token) => lower.includes(token));
}

export function receiptContainsRequiredFields(
  text: string,
  model: HumanApprovalReceiptModel,
): boolean {
  return (
    text.includes(model.confirmationHeading) &&
    text.includes(model.correlationId) &&
    text.includes(model.auditId) &&
    text.includes(model.action) &&
    text.includes(model.scope)
  );
}

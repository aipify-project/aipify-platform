import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionActionDefinition } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";
import type { CompanionActionExecutionResult } from "./companion-action-execution-result";
import type { CompanionExecutionGateReason } from "./companion-action-execution-gate";

function executionStatusKey(status: CompanionActionExecutionResult["status"]): string {
  return `customerApp.companionPlatformKnowledge.execution.status.${status}`;
}

function executionErrorKey(code: string): string {
  const gateKeys = new Set([
    "app_suspended",
    "entitlement_blocked",
    "provider_unverified",
    "capability_disabled",
    "schema_validation",
    "permission_denied",
    "missing_policy",
    "approval_missing",
    "approval_expired",
    "idempotency_invalid",
    "duplicate_idempotency",
    "irreversible_blocked",
    "risk_too_high",
    "forbidden_action",
    "missing_adapter",
    "emergency_stop",
    "execution_disabled",
    "blocked",
    "provider_failure",
    "validation_failed",
    "invalid_output",
  ]);
  if (gateKeys.has(code)) {
    return `customerApp.companionPlatformKnowledge.execution.gate.${code}`;
  }
  return `customerApp.companionPlatformKnowledge.execution.gate.blocked`;
}

export function buildCompanionExecutionAnswer(
  definition: CompanionActionDefinition,
  execution: CompanionActionExecutionResult,
  actionContext: CompanionActionContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  const statusLabel = t(executionStatusKey(execution.status));
  const lead = t("customerApp.companionPlatformKnowledge.execution.lead")
    .replace("{actionId}", definition.action_id)
    .replace("{status}", statusLabel);

  const auditLine = execution.audit_reference
    ? t("customerApp.companionPlatformKnowledge.execution.auditLine").replace(
        "{reference}",
        execution.audit_reference,
      )
    : "";

  const rollbackLine = execution.rollback_available
    ? t("customerApp.companionPlatformKnowledge.execution.rollbackAvailable")
    : "";

  const partialLine = execution.status === "partially_completed"
    ? t("customerApp.companionPlatformKnowledge.execution.partialWarning")
    : "";

  const errorLine = execution.error_code
    ? t(executionErrorKey(execution.error_code))
    : "";

  const completedAt = execution.completed_at
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(execution.completed_at),
      )
    : t("customerApp.companionPlatformKnowledge.grounded.timestampUnavailable");

  const completedLine = t("customerApp.companionPlatformKnowledge.execution.completedLine").replace(
    "{completedAt}",
    completedAt,
  );

  const resultMessage =
    typeof execution.result.message === "string" ? execution.result.message : "";

  return {
    directAnswer: lead,
    explanation: [
      completedLine,
      resultMessage,
      auditLine,
      rollbackLine,
      partialLine,
      errorLine,
    ]
      .filter(Boolean)
      .join("\n"),
    steps: [],
    actions:
      execution.status === "awaiting_approval"
        ? [
            {
              labelKey: "customerApp.companionPlatformKnowledge.actions.openApprovals",
              label: t("customerApp.companionPlatformKnowledge.actions.openApprovals"),
              href: actionContext.cross_link_approvals,
              routeKey: "approvals",
            },
          ]
        : [],
    sources: [
      {
        id: execution.execution_id || definition.action_id,
        label: t("customerApp.companionPlatformKnowledge.execution.sourceLabel"),
        kind: "customer_context",
        meta: execution.status,
      },
    ],
    sourceId: definition.action_id,
    source: "customer_context",
    confidence:
      execution.status === "completed" ? "high" : execution.status === "failed" ? "low" : "moderate",
    showSupportEscalation: execution.status === "failed" || execution.status === "blocked",
  };
}

export function buildCompanionExecutionBlockedAnswer(
  reason: CompanionExecutionGateReason,
  definition: CompanionActionDefinition,
  actionContext: CompanionActionContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  return {
    directAnswer: t(executionErrorKey(reason)),
    explanation: t("customerApp.companionPlatformKnowledge.execution.blockedExplanation"),
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.actions.openApprovals",
        label: t("customerApp.companionPlatformKnowledge.actions.openApprovals"),
        href: actionContext.cross_link_approvals,
        routeKey: "approvals",
      },
    ],
    sources: [
      {
        id: definition.action_id,
        label: t("customerApp.companionPlatformKnowledge.execution.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: definition.action_id,
    source: "customer_context",
    confidence: "low",
  };
}

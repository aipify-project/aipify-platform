import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionActionDefinition } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";
import type { CompanionActionPlan } from "./companion-action-plan";
import type { CompanionActionBlockReason } from "./companion-action-governance";

function riskLabelKey(level: number): string {
  return `customerApp.companionPlatformKnowledge.actions.riskLevel.${level}`;
}

function blockReasonKey(reason: CompanionActionBlockReason): string {
  return `customerApp.companionPlatformKnowledge.actions.blockReason.${reason}`;
}

function statusKey(status: CompanionActionPlan["approval_status"]): string {
  return `customerApp.companionPlatformKnowledge.actions.approvalStatus.${status}`;
}

export function buildCompanionActionExplanationAnswer(
  definition: CompanionActionDefinition,
  plan: CompanionActionPlan,
  actionContext: CompanionActionContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  const riskLabel = t(riskLabelKey(plan.risk_level));
  const statusLabel = t(statusKey(plan.approval_status));
  const lead = t("customerApp.companionPlatformKnowledge.actions.explanationLead")
    .replace("{actionId}", definition.action_id)
    .replace("{entity}", definition.entity)
    .replace("{provider}", definition.provider_key);

  const riskLine = t("customerApp.companionPlatformKnowledge.actions.riskLine").replace(
    "{risk}",
    riskLabel,
  );
  const approvalLine = t("customerApp.companionPlatformKnowledge.actions.approvalLine").replace(
    "{status}",
    statusLabel,
  );
  const reversibleLine = plan.reversible
    ? t("customerApp.companionPlatformKnowledge.actions.reversibleYes")
    : t("customerApp.companionPlatformKnowledge.actions.reversibleNo");

  const auditLine = plan.source_reference
    ? t("customerApp.companionPlatformKnowledge.actions.auditLine").replace(
        "{reference}",
        plan.source_reference,
      )
    : "";

  const effectiveFrom = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(plan.created_at),
  );
  const preparedLine = t("customerApp.companionPlatformKnowledge.actions.preparedLine").replace(
    "{createdAt}",
    effectiveFrom,
  );

  const actions =
    plan.approval_status === "pending"
      ? [
          {
            labelKey: "customerApp.companionPlatformKnowledge.actions.openApprovals",
            label: t("customerApp.companionPlatformKnowledge.actions.openApprovals"),
            href: actionContext.cross_link_approvals,
            routeKey: "approvals",
          },
        ]
      : [];

  return {
    directAnswer: lead,
    explanation: [riskLine, approvalLine, reversibleLine, preparedLine, auditLine]
      .filter(Boolean)
      .join("\n"),
    steps: [],
    actions,
    sources: [
      {
        id: definition.action_id,
        label: t("customerApp.companionPlatformKnowledge.actions.sourceLabel"),
        kind: "customer_context",
        meta: definition.source,
      },
    ],
    sourceId: definition.action_id,
    source: "customer_context",
    confidence: plan.approval_status === "blocked" || plan.approval_status === "prohibited" ? "low" : "moderate",
    showSupportEscalation: plan.approval_status === "prohibited",
  };
}

export function buildCompanionActionBlockedAnswer(
  reason: CompanionActionBlockReason,
  definition: CompanionActionDefinition | null,
  actionContext: CompanionActionContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  return {
    directAnswer: t(blockReasonKey(reason)),
    explanation: [
      t("customerApp.companionPlatformKnowledge.actions.blockedExplanation"),
      actionContext.app_suspended
        ? t("customerApp.companionPlatformKnowledge.actions.appSuspended")
        : "",
      actionContext.emergency_state !== "normal"
        ? t("customerApp.companionPlatformKnowledge.actions.emergencyStop")
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
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
        id: definition?.action_id ?? "action-blocked",
        label: t("customerApp.companionPlatformKnowledge.actions.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: definition?.action_id ?? "action-blocked",
    source: "customer_context",
    confidence: "low",
    showSupportEscalation: reason === "critical_prohibited" || reason === "irreversible_blocked",
  };
}

export function buildCompanionActionUnavailableAnswer(
  t: Translator,
  actionContext: CompanionActionContext,
): PlatformKnowledgeAnswer {
  const reason = actionContext.permission_denied
    ? t("customerApp.companionPlatformKnowledge.actions.permissionDenied")
    : actionContext.missing_policy
      ? t("customerApp.companionPlatformKnowledge.actions.missingPolicy")
      : t("customerApp.companionPlatformKnowledge.actions.unavailable");

  return {
    directAnswer: reason,
    explanation: t("customerApp.companionPlatformKnowledge.actions.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "action-unavailable",
        label: t("customerApp.companionPlatformKnowledge.actions.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "action-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildCompanionActionReadyAnswer(
  definition: CompanionActionDefinition,
  plan: CompanionActionPlan,
  actionContext: CompanionActionContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  const answer = buildCompanionActionExplanationAnswer(definition, plan, actionContext, t, locale);
  return {
    ...answer,
    directAnswer: t("customerApp.companionPlatformKnowledge.actions.readyLead").replace(
      "{actionId}",
      definition.action_id,
    ),
    explanation: [
      answer.explanation,
      t("customerApp.companionPlatformKnowledge.actions.readyExplanation"),
    ]
      .filter(Boolean)
      .join("\n"),
    confidence: "moderate",
  };
}

export function buildCompanionActionApprovalRequiredAnswer(
  definition: CompanionActionDefinition,
  plan: CompanionActionPlan,
  actionContext: CompanionActionContext,
  t: Translator,
  locale: CustomerActiveLocale,
): PlatformKnowledgeAnswer {
  const answer = buildCompanionActionExplanationAnswer(definition, plan, actionContext, t, locale);
  return {
    ...answer,
    directAnswer: t("customerApp.companionPlatformKnowledge.actions.approvalRequiredLead").replace(
      "{actionId}",
      definition.action_id,
    ),
    explanation: [
      answer.explanation,
      t("customerApp.companionPlatformKnowledge.actions.approvalRequiredExplanation"),
    ]
      .filter(Boolean)
      .join("\n"),
    confidence: "moderate",
  };
}

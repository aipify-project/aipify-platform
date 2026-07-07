import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import { filterCompanionSelfNavigationActions } from "./organization-intelligence-answer";

const BASE = "customerApp.companionPlatformKnowledge.unknownOrganizationSource";

const ORGANIZATION_APPROVER_ROLES = new Set([
  "organization_owner",
  "organization_admin",
  "owner",
  "admin",
  "administrator",
]);

export function isCompanionOrganizationApprover(role: string | null | undefined): boolean {
  if (!role) return false;
  return ORGANIZATION_APPROVER_ROLES.has(role);
}

export function buildUnknownOrganizationSourceAnswer(input: {
  t: Translator;
  organizationRole?: string | null;
  effectivePermissions?: readonly string[];
}): PlatformKnowledgeAnswer {
  const isApprover =
    isCompanionOrganizationApprover(input.organizationRole) ||
    (input.effectivePermissions?.includes("integrations.manage") ?? false) ||
    (input.effectivePermissions?.includes("governance.approve") ?? false);

  const directAnswer = input.t(
    isApprover ? `${BASE}.ownerDirectAnswer` : `${BASE}.employeeDirectAnswer`,
  );
  const explanation = input.t(
    isApprover ? `${BASE}.ownerExplanation` : `${BASE}.employeeExplanation`,
  );

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: filterCompanionSelfNavigationActions([]),
    sources: [],
    sourceId: "organization-unknown-source",
    source: "customer_context",
    confidence: "low",
    showSupportEscalation: false,
    requestedLiveIntegration: false,
    liveIntegrationToolUsed: false,
  };
}

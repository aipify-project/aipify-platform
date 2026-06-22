import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { PlatformKnowledgeAnswer, PlatformKnowledgeSourceRef } from "@/lib/companion-platform-knowledge/types";
import type { CompanionIdentityContext } from "./companion-identity-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type CompanionModelSourceMetadata = {
  id: string;
  label: string;
  kind: PlatformKnowledgeSourceRef["kind"];
  meta?: string;
  freshness?: string | null;
  priority: "live" | "memory" | "knowledge" | "context";
};

export type CompanionModelOrganizationContext = {
  organization_id: string | null;
  organization_name: string | null;
  organization_role: string | null;
  plan_key: string | null;
  subscription_status: string | null;
};

export type CompanionModelIdentityContext = {
  personalization_enabled: boolean;
  warmth_level: string;
  empathy_enabled: boolean;
  humor_enabled: boolean;
  serious_context_only: boolean;
  preferred_name: string | null;
};

export type CompanionModelContext = {
  user_query: string;
  locale: CustomerActiveLocale;
  grounded_facts: string[];
  source_metadata: CompanionModelSourceMetadata[];
  organization_context: CompanionModelOrganizationContext;
  approved_memory: string[];
  operational_context: string[];
  capabilities: string[];
  permissions: string[];
  warnings: string[];
  answer_constraints: string[];
  identity_context: CompanionModelIdentityContext;
  data_classification: "public" | "operational" | "sensitive" | "restricted";
  complexity: "low" | "medium" | "high";
  risk_level: "low" | "medium" | "high";
  live_data_present: boolean;
};

const FIELD_VALUE_PATTERN = /^[\w\s.-]+:\s*.+$/;
const SECRET_FIELD_PATTERN =
  /password|secret|token|credential|api_key|private_key|auth_header|bearer/i;

function sanitizeFactLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (SECRET_FIELD_PATTERN.test(trimmed)) return null;
  return trimmed;
}

export function extractGroundedFactsFromAnswer(answer: PlatformKnowledgeAnswer): string[] {
  const facts = new Set<string>();

  for (const line of answer.directAnswer.split("\n")) {
    const sanitized = sanitizeFactLine(line);
    if (!sanitized) continue;
    if (
      FIELD_VALUE_PATTERN.test(sanitized) ||
      sanitized.startsWith("•")
    ) {
      facts.add(sanitized);
    }
  }

  if (facts.size === 0 && answer.directAnswer.trim()) {
    for (const line of answer.directAnswer.split("\n")) {
      const sanitized = sanitizeFactLine(line);
      if (sanitized) facts.add(sanitized);
    }
  }

  return [...facts];
}

function resolveSourcePriority(
  source: PlatformKnowledgeSourceRef,
  liveAnswer: boolean,
): CompanionModelSourceMetadata["priority"] {
  if (source.kind === "verified_integration" || liveAnswer) return "live";
  if (source.kind === "org_knowledge") return "memory";
  if (source.kind === "knowledge_center" || source.kind === "platform_corpus") return "knowledge";
  return "context";
}

export function orderSourceMetadataForModel(
  sources: PlatformKnowledgeSourceRef[],
  liveAnswer: boolean,
): CompanionModelSourceMetadata[] {
  const mapped = sources.map((source) => ({
    id: source.id,
    label: source.label,
    kind: source.kind,
    meta: source.meta,
    freshness: source.meta ?? null,
    priority: resolveSourcePriority(source, liveAnswer),
  }));

  const rank: Record<CompanionModelSourceMetadata["priority"], number> = {
    live: 0,
    context: 1,
    knowledge: 2,
    memory: 3,
  };

  return [...mapped].sort((a, b) => rank[a.priority] - rank[b.priority]);
}

function buildIdentityContext(identity: CompanionIdentityContext): CompanionModelIdentityContext {
  return {
    personalization_enabled: identity.personalization_enabled,
    warmth_level: identity.warmth_level,
    empathy_enabled: identity.empathy_enabled,
    humor_enabled: identity.humor_enabled,
    serious_context_only: identity.serious_context_only,
    preferred_name: identity.preferred_name,
  };
}

function resolveDataClassification(input: {
  permissions: string[];
  warnings: string[];
  liveDataPresent: boolean;
  approvedMemoryCount: number;
}): CompanionModelContext["data_classification"] {
  if (input.warnings.includes("permission_denied") || input.warnings.includes("restricted")) {
    return "restricted";
  }
  if (input.warnings.includes("sensitive") || input.warnings.includes("billing")) {
    return "sensitive";
  }
  if (input.liveDataPresent || input.approvedMemoryCount > 0) {
    return "operational";
  }
  return "public";
}

function resolveComplexity(factCount: number, sourceCount: number): CompanionModelContext["complexity"] {
  if (factCount > 6 || sourceCount > 3) return "high";
  if (factCount > 2 || sourceCount > 1) return "medium";
  return "low";
}

function resolveRiskLevel(input: {
  dataClassification: CompanionModelContext["data_classification"];
  warnings: string[];
  confidence: PlatformKnowledgeAnswer["confidence"];
}): CompanionModelContext["risk_level"] {
  if (input.dataClassification === "restricted" || input.dataClassification === "sensitive") {
    return "high";
  }
  if (input.warnings.includes("emergency_stop") || input.warnings.includes("critical")) {
    return "high";
  }
  if (input.confidence === "low") return "medium";
  return "low";
}

export function buildCompanionModelContext(input: {
  query: string;
  locale: CustomerActiveLocale;
  answer: PlatformKnowledgeAnswer;
  tenantContext: CompanionTenantContext;
  liveAnswer?: boolean;
  constraintKeys?: string[];
}): CompanionModelContext {
  const groundedFacts = extractGroundedFactsFromAnswer(input.answer);
  const sourceMetadata = orderSourceMetadataForModel(
    input.answer.sources,
    Boolean(input.liveAnswer || input.answer.liveIntegrationToolUsed),
  );
  const liveDataPresent = sourceMetadata.some((source) => source.priority === "live");

  const approvedMemory = input.tenantContext.memoryContext.confirmed_knowledge
    .slice(0, 5)
    .map((item) => item.summary.trim())
    .filter(Boolean);

  const operationalContext = [
    ...input.tenantContext.operationalContext.attention_items
      .slice(0, 3)
      .map((item) => item.title.trim())
      .filter(Boolean),
    ...input.tenantContext.operationalContext.recommended_next_actions
      .slice(0, 2)
      .map((action) => action.title.trim())
      .filter(Boolean),
  ];

  const capabilities = [
    ...input.tenantContext.entitledCapabilities.map((cap) => cap.capability_id),
    ...input.tenantContext.availableOperations.map((op) => `schema.${op}`),
  ];

  const warnings: string[] = [];
  if (input.answer.confidence === "low") warnings.push("low_confidence");
  if (input.answer.showSupportEscalation) warnings.push("support_escalation");
  if (input.answer.orgConfirmBlockedReason) warnings.push("org_confirm_blocked");
  if (input.tenantContext.actionContext.permission_denied) warnings.push("permission_denied");
  if (input.tenantContext.actionContext.emergency_state !== "normal") {
    warnings.push("emergency_stop");
  }

  const permissions = [...input.tenantContext.effectivePermissions];
  const dataClassification = resolveDataClassification({
    permissions,
    warnings,
    liveDataPresent,
    approvedMemoryCount: approvedMemory.length,
  });
  const complexity = resolveComplexity(groundedFacts.length, sourceMetadata.length);
  const riskLevel = resolveRiskLevel({
    dataClassification,
    warnings,
    confidence: input.answer.confidence,
  });

  return {
    user_query: input.query.trim(),
    locale: input.locale,
    grounded_facts: groundedFacts,
    source_metadata: sourceMetadata,
    organization_context: {
      organization_id: input.tenantContext.organizationId,
      organization_name: input.tenantContext.organizationName,
      organization_role: input.tenantContext.organizationRole,
      plan_key: input.tenantContext.planKey,
      subscription_status: input.tenantContext.subscriptionStatus,
    },
    approved_memory: approvedMemory,
    operational_context: operationalContext,
    capabilities,
    permissions,
    warnings,
    answer_constraints: input.constraintKeys ?? [],
    identity_context: buildIdentityContext(input.tenantContext.identityContext),
    data_classification: dataClassification,
    complexity,
    risk_level: riskLevel,
    live_data_present: liveDataPresent,
  };
}

export function hasSufficientGroundingForSynthesis(context: CompanionModelContext): boolean {
  if (context.grounded_facts.length === 0 && context.source_metadata.length === 0) {
    return false;
  }
  if (context.grounded_facts.length === 0 && context.source_metadata.length > 0) {
    return context.source_metadata.some((source) => source.priority === "live");
  }
  return context.grounded_facts.length > 0;
}

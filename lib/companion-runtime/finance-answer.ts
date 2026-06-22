import {
  getFinanceProviderManifest,
  listFinanceProviderManifests,
} from "@/lib/integration-intelligence/finance/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionFinanceContext } from "./companion-finance-context";
import { filterFinanceCapabilitiesForPrivacy } from "./companion-finance-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type FinanceProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeFinanceQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasFinanceProviderIntent(query: string): boolean {
  const normalized = normalizeFinanceQuery(query);
  return /\b(finance|financial|revenue|expense|expenses|invoice|invoices|subscription|subscriptions|payment|payments|payout|payouts|refund|billing|forecast|forecasts|reconciliation|accounting|fiken|stripe|vipps|klarna|dnb|churn|cash flow|profit|margin|ledger)\b/i.test(
    normalized,
  );
}

export function hasBlockedFinanceOperationIntent(query: string): boolean {
  const normalized = normalizeFinanceQuery(query);
  return /\b(execute payment|process payment|pay out|payout now|issue refund|refund payment|bank transfer|wire transfer|send invoice|cancel subscription|destructive correction|irreversible posting|post to ledger|financial posting without approval)\b/i.test(
    normalized,
  );
}

export function hasExternalFinanceAdapterIntent(query: string): boolean {
  const normalized = normalizeFinanceQuery(query);
  return /\b(external accounting adapter|live fiken sync|external stripe adapter|third.?party erp sync|external finance adapter)\b/i.test(
    normalized,
  );
}

export function matchFinanceProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): FinanceProviderMatch | null {
  if (!hasFinanceProviderIntent(query)) return null;

  const normalized = normalizeFinanceQuery(query);
  const manifests = listFinanceProviderManifests();

  const mentionedProviders = manifests.filter((manifest) => {
    const provider = manifest.provider_key.toLowerCase();
    const providerSpaced = provider.replace(/_/g, " ");
    return normalized.includes(providerSpaced) || normalized.includes(provider);
  });

  if (mentionedProviders.length > 0) {
    for (const manifest of mentionedProviders) {
      for (const capability of manifest.capabilities) {
        const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
        if (normalized.includes(capabilityPhrase)) {
          return {
            provider_key: manifest.provider_key,
            capability_key: capability.capability_key,
            operation: capability.operation,
          };
        }
      }
    }

    return {
      provider_key: mentionedProviders[0]!.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  for (const manifest of manifests) {
    for (const capability of manifest.capabilities) {
      const capabilityPhrase = capability.capability_key.replace(/\./g, " ");
      if (normalized.includes(capabilityPhrase)) {
        return {
          provider_key: manifest.provider_key,
          capability_key: capability.capability_key,
          operation: capability.operation,
        };
      }
    }
  }

  const keywordMatch = manifests.find((manifest) => {
    if (normalized.includes("revenue") || normalized.includes("forecast")) {
      return (
        manifest.provider_key === "revenue_operations" ||
        manifest.capabilities.some((capability) => capability.capability_key === "revenue.read")
      );
    }
    if (normalized.includes("expense")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "expense.read");
    }
    if (normalized.includes("invoice")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "invoice.read");
    }
    if (normalized.includes("subscription")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "subscription.read",
      );
    }
    if (normalized.includes("payment") || normalized.includes("stripe") || normalized.includes("vipps") || normalized.includes("klarna")) {
      return (
        manifest.provider_key === "payment_providers" ||
        manifest.capabilities.some((capability) => capability.capability_key === "payment.read")
      );
    }
    if (normalized.includes("payout")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "payout.read");
    }
    if (normalized.includes("billing")) {
      return manifest.provider_key === "unified_billing";
    }
    if (normalized.includes("reconciliation") || normalized.includes("accounting") || normalized.includes("fiken")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "reconciliation.read",
      );
    }
    if (normalized.includes("report")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "report.read");
    }
    if (normalized.includes("dnb")) {
      return manifest.provider_key === "enterprise_invoicing";
    }
    return false;
  });

  if (keywordMatch) {
    return {
      provider_key: keywordMatch.provider_key,
      capability_key: null,
      operation: null,
    };
  }

  const writeIntent = /\b(draft|export|create)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary|how much)\b/i.test(
    normalized,
  );
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.financeContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveFinanceCrossLink(
  match: FinanceProviderMatch,
  financeContext: CompanionFinanceContext,
): string {
  if (match.provider_key === "revenue_operations") {
    return financeContext.cross_link_revenue;
  }
  if (match.provider_key === "unified_billing") {
    return financeContext.cross_link_billing;
  }
  if (match.provider_key === "payment_providers") {
    return financeContext.cross_link_payment_providers;
  }
  return financeContext.cross_link_finance;
}

export function buildFinanceProviderDiscoveryAnswer(
  match: FinanceProviderMatch,
  financeContext: CompanionFinanceContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getFinanceProviderManifest(match.provider_key);
  const providerStatus = financeContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.finance.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.finance.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterFinanceCapabilitiesForPrivacy(financeContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.finance.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.finance.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    financeContext.payment_execution_blocked
      ? t("customerApp.companionPlatformKnowledge.finance.paymentExecutionBlocked")
      : null,
    financeContext.refund_execution_blocked
      ? t("customerApp.companionPlatformKnowledge.finance.refundExecutionBlocked")
      : null,
    financeContext.invoice_send_blocked
      ? t("customerApp.companionPlatformKnowledge.finance.invoiceSendBlocked")
      : null,
    financeContext.sensitive_account_data_masked
      ? t("customerApp.companionPlatformKnowledge.finance.sensitiveDataMasked")
      : null,
    financeContext.no_raw_card_or_bank_details
      ? t("customerApp.companionPlatformKnowledge.finance.noRawCardOrBankDetails")
      : null,
    financeContext.finance_role_filter_active
      ? t("customerApp.companionPlatformKnowledge.finance.financeRoleFilterActive")
      : null,
    financeContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.finance.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.finance.commandBriefEventsAvailable"),
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.finance.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.finance.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.finance.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.finance.privacyNote"),
    t("customerApp.companionPlatformKnowledge.finance.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.finance.openFinanceCenter",
        label: t("customerApp.companionPlatformKnowledge.finance.openFinanceCenter"),
        href: resolveFinanceCrossLink(match, financeContext),
        routeKey: "appFinance",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.finance.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildFinanceProviderUnavailableAnswer(
  t: Translator,
  financeContext: CompanionFinanceContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.finance.unavailableLead"),
    explanation: financeContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.finance.permissionDenied")
      : financeContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.finance.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.finance.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "finance-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.finance.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "finance-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedFinanceOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.finance.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.finance.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "finance-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.finance.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "finance-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalFinanceUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.finance.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.finance.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "finance-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.finance.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "finance-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

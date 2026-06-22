import {
  getHrProviderManifest,
  listHrProviderManifests,
} from "@/lib/integration-intelligence/hr/registry";
import type { Translator } from "@/lib/i18n/translate";
import type { CompanionHrContext } from "./companion-hr-context";
import { filterHrCapabilitiesForPrivacy } from "./companion-hr-context";
import type { CompanionTenantContext } from "./companion-tenant-context";

export type HrProviderMatch = {
  provider_key: string;
  capability_key: string | null;
  operation: "read" | "write" | null;
};

function normalizeHrQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function hasHrProviderIntent(query: string): boolean {
  const normalized = normalizeHrQuery(query);
  return /\b(hr|human resources|people operations|workforce|employee|employees|team|teams|department|departments|role|roles|onboarding|offboarding|absence|leave|vacation mode|schedule|scheduling|training|certification|performance review|workforce insight|people ops)\b/i.test(
    normalized,
  );
}

export function hasBlockedHrOperationIntent(query: string): boolean {
  const normalized = normalizeHrQuery(query);
  return /\b(salary change|pay change|terminate employee|fire employee|delete employee|health record|medical record|legal decision|revoke access|irreversible|compensation change|layoff)\b/i.test(
    normalized,
  );
}

export function hasExternalHrAdapterIntent(query: string): boolean {
  const normalized = normalizeHrQuery(query);
  return /\b(external hr adapter|third.?party hr|live payroll sync|external hris adapter)\b/i.test(
    normalized,
  );
}

export function matchHrProviderQuery(
  query: string,
  tenantContext: CompanionTenantContext,
): HrProviderMatch | null {
  if (!hasHrProviderIntent(query)) return null;

  const normalized = normalizeHrQuery(query);
  const manifests = listHrProviderManifests();

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
    if (normalized.includes("employee") || normalized.includes("directory")) {
      return manifest.provider_key === "workforce_employee_directory";
    }
    if (normalized.includes("team")) {
      return manifest.provider_key === "workforce_team";
    }
    if (normalized.includes("onboarding") || normalized.includes("offboarding")) {
      return manifest.provider_key === "workforce_lifecycle";
    }
    if (
      normalized.includes("training") ||
      normalized.includes("certification") ||
      normalized.includes("performance")
    ) {
      return manifest.provider_key === "workforce_people_operations";
    }
    if (normalized.includes("schedule") || normalized.includes("shift")) {
      return manifest.provider_key === "workforce_scheduling_hr";
    }
    if (normalized.includes("absence") || normalized.includes("leave")) {
      return manifest.provider_key === "workforce_absence_hr";
    }
    if (normalized.includes("department")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "department.read",
      );
    }
    if (normalized.includes("role")) {
      return manifest.capabilities.some((capability) => capability.capability_key === "role.read");
    }
    if (normalized.includes("task") || normalized.includes("assign")) {
      return manifest.capabilities.some(
        (capability) => capability.capability_key === "task.assign",
      );
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

  const writeIntent = /\b(create|assign|update|onboard)\b/i.test(normalized);
  const readIntent = /\b(read|show|list|status|what|which|find|summary|who)\b/i.test(normalized);
  const operation = writeIntent ? "write" : readIntent ? "read" : null;

  const firstProvider = tenantContext.hrContext.providers[0];
  if (firstProvider) {
    return { provider_key: firstProvider.provider_key, capability_key: null, operation };
  }

  return null;
}

function resolveHrCrossLink(match: HrProviderMatch, hrContext: CompanionHrContext): string {
  if (match.provider_key === "workforce_lifecycle") {
    return hrContext.cross_link_onboarding;
  }
  if (match.provider_key === "workforce_people_operations") {
    return hrContext.cross_link_people;
  }
  if (match.provider_key === "workforce_scheduling_hr") {
    return hrContext.cross_link_scheduling;
  }
  if (match.provider_key === "workforce_absence_hr") {
    return hrContext.cross_link_absence;
  }
  if (match.provider_key === "workforce_team") {
    return hrContext.cross_link_team;
  }
  return hrContext.cross_link_employees;
}

export function buildHrProviderDiscoveryAnswer(
  match: HrProviderMatch,
  hrContext: CompanionHrContext,
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  const manifest = getHrProviderManifest(match.provider_key);
  const providerStatus = hrContext.providers.find(
    (provider) => provider.provider_key === match.provider_key,
  );

  const statusKey = providerStatus?.implementation_status ?? "specification_only";
  const statusLabel = t(`customerApp.companionPlatformKnowledge.hr.status.${statusKey}`);

  const directAnswer = t("customerApp.companionPlatformKnowledge.hr.discoveryLead")
    .replace("{provider}", manifest ? t(manifest.display_name_key) : match.provider_key)
    .replace("{status}", statusLabel);

  const capabilityLines = filterHrCapabilitiesForPrivacy(hrContext)
    .filter((capability) => capability.provider_key === match.provider_key)
    .slice(0, 6)
    .map((capability) =>
      t("customerApp.companionPlatformKnowledge.hr.capabilityLine")
        .replace("{capabilityId}", capability.capability_id)
        .replace(
          "{mode}",
          t(`customerApp.companionPlatformKnowledge.hr.operation.${capability.operation}`),
        ),
    )
    .join("\n");

  const governanceLines = [
    hrContext.salary_change_blocked
      ? t("customerApp.companionPlatformKnowledge.hr.salaryChangeBlocked")
      : null,
    hrContext.termination_blocked
      ? t("customerApp.companionPlatformKnowledge.hr.terminationBlocked")
      : null,
    hrContext.health_data_blocked
      ? t("customerApp.companionPlatformKnowledge.hr.healthDataBlocked")
      : null,
    hrContext.least_privilege_enforced
      ? t("customerApp.companionPlatformKnowledge.hr.leastPrivilegeEnforced")
      : null,
    hrContext.department_scope_active
      ? t("customerApp.companionPlatformKnowledge.hr.departmentScopeActive")
      : null,
    hrContext.vacation_mode_active
      ? t("customerApp.companionPlatformKnowledge.hr.vacationModeActive")
      : t("customerApp.companionPlatformKnowledge.hr.vacationModeAvailable"),
    hrContext.command_brief_events_linked
      ? t("customerApp.companionPlatformKnowledge.hr.commandBriefEventsLinked")
      : t("customerApp.companionPlatformKnowledge.hr.commandBriefEventsAvailable"),
    hrContext.human_oversight_required
      ? t("customerApp.companionPlatformKnowledge.hr.humanOversightRequired")
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const explanation = [
    t("customerApp.companionPlatformKnowledge.hr.discoveryExplanation"),
    capabilityLines,
    governanceLines,
    providerStatus?.verified
      ? t("customerApp.companionPlatformKnowledge.hr.verifiedProvider")
      : t("customerApp.companionPlatformKnowledge.hr.disconnectedProvider"),
    t("customerApp.companionPlatformKnowledge.hr.privacyNote"),
    t("customerApp.companionPlatformKnowledge.hr.policyNote"),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [
      {
        labelKey: "customerApp.companionPlatformKnowledge.hr.openHrCenter",
        label: t("customerApp.companionPlatformKnowledge.hr.openHrCenter"),
        href: resolveHrCrossLink(match, hrContext),
        routeKey: "appEmployees",
      },
    ],
    sources: [
      {
        id: match.provider_key,
        label: t("customerApp.companionPlatformKnowledge.hr.sourceLabel"),
        kind: "customer_context",
        meta: statusKey,
      },
    ],
    sourceId: match.provider_key,
    source: "customer_context",
    confidence: providerStatus?.verified ? "moderate" : "low",
  };
}

export function buildHrProviderUnavailableAnswer(
  t: Translator,
  hrContext: CompanionHrContext,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.hr.unavailableLead"),
    explanation: hrContext.permission_denied
      ? t("customerApp.companionPlatformKnowledge.hr.permissionDenied")
      : hrContext.app_entitlement_blocked
        ? t("customerApp.companionPlatformKnowledge.hr.entitlementBlocked")
        : t("customerApp.companionPlatformKnowledge.hr.unavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "hr-provider-unavailable",
        label: t("customerApp.companionPlatformKnowledge.hr.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "hr-provider-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

export function buildBlockedHrOperationAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.hr.blockedOperationLead"),
    explanation: t("customerApp.companionPlatformKnowledge.hr.blockedOperationExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "hr-blocked-operation",
        label: t("customerApp.companionPlatformKnowledge.hr.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "hr-blocked-operation",
    source: "customer_context",
    confidence: "high",
  };
}

export function buildExternalHrUnavailableAnswer(
  t: Translator,
): import("@/lib/companion-platform-knowledge/types").PlatformKnowledgeAnswer {
  return {
    directAnswer: t("customerApp.companionPlatformKnowledge.hr.externalUnavailableLead"),
    explanation: t("customerApp.companionPlatformKnowledge.hr.externalUnavailableExplanation"),
    steps: [],
    actions: [],
    sources: [
      {
        id: "hr-external-unavailable",
        label: t("customerApp.companionPlatformKnowledge.hr.sourceLabel"),
        kind: "customer_context",
      },
    ],
    sourceId: "hr-external-unavailable",
    source: "customer_context",
    confidence: "low",
  };
}

import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import {
  buildOrganizationAccessEmployeeMessage,
  buildOrganizationAccessRequestActions,
  resolveProviderFriendlyLabel,
} from "@/lib/core/organization-access-approval/labels";
import {
  normalizeOrganizationAccessProviderKey,
  resolveProviderAccessManifest,
  resolveScopesForCapability,
} from "@/lib/core/organization-access-approval/provider-scope-registry";
import type { OrganizationAccessOfferContext } from "@/lib/core/organization-access-approval/types";
import type { OrganizationExecutionKind } from "./organization-capability-resolution";

const SETTINGS_ROUTE = "/app/settings/organization-access";

export function buildOrganizationAccessRequiredAnswer(input: {
  t: Translator;
  offer: OrganizationAccessOfferContext;
}): PlatformKnowledgeAnswer {
  const manifest = resolveProviderAccessManifest(input.offer.provider_key);
  const scopeKeys =
    input.offer.scope_keys.length > 0
      ? input.offer.scope_keys
      : resolveScopesForCapability({
          provider_key: input.offer.provider_key,
          capability_key: input.offer.capability_key,
        });

  const providerLabel = resolveProviderFriendlyLabel(input.t, input.offer.provider_key);
  const whyNeeded = manifest ? input.t(manifest.why_needed_label_key) : null;

  return {
    directAnswer: buildOrganizationAccessEmployeeMessage(input.t),
    explanation: [
      whyNeeded,
      input.t("customerApp.organizationAccessApproval.employee.providerContext").replace(
        "{provider}",
        providerLabel,
      ),
    ]
      .filter(Boolean)
      .join("\n\n"),
    steps: [],
    actions: buildOrganizationAccessRequestActions(input.t).map((action) => ({
      labelKey: `customerApp.organizationAccessApproval.employee.actions.${action.id === "submit_access_request" ? "submit" : "cancel"}`,
      label: action.label,
      href:
        action.id === "submit_access_request"
          ? `${SETTINGS_ROUTE}?intent=create&provider=${encodeURIComponent(input.offer.provider_key)}`
          : SETTINGS_ROUTE,
      routeKey: action.id === "submit_access_request" ? "organizationAccessApproval" : "organizationAccessApprovalCancel",
      variant: action.kind,
    })),
    sources: [],
    sourceId: "organization-access-offer",
    source: "customer_context",
    confidence: "moderate",
    showSupportEscalation: false,
    requestedLiveIntegration: true,
  };
}

export function resolveAccessProviderKeyForRoute(input: {
  provider_key: string;
  execution_kind?: OrganizationExecutionKind;
}): string {
  if (input.execution_kind === "member_count") {
    return "organization_member_count";
  }
  return normalizeOrganizationAccessProviderKey(input.provider_key);
}

export function resolveAccessOfferFromCapability(input: {
  provider_key: string;
  capability_key?: string | null;
  execution_kind?: OrganizationExecutionKind;
  context_payload?: Record<string, unknown>;
}): OrganizationAccessOfferContext {
  const providerKey = resolveAccessProviderKeyForRoute({
    provider_key: input.provider_key,
    execution_kind: input.execution_kind,
  });
  const manifest = resolveProviderAccessManifest(providerKey);
  const scopeKeys = resolveScopesForCapability({
    provider_key: providerKey,
    capability_key: input.capability_key,
  });

  return {
    provider_key: providerKey,
    capability_key: input.capability_key ?? null,
    scope_keys: scopeKeys,
    access_mode: manifest?.required_scopes[0]?.default_access_mode ?? "one_time",
    duration_hours: manifest?.required_scopes[0]?.default_duration_hours ?? null,
    context_payload: input.context_payload ?? {},
  };
}

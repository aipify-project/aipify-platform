import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { Translator } from "@/lib/i18n/translate";
import {
  buildOrganizationAccessEmployeeMessage,
  buildOrganizationAccessRequestActions,
  buildOrganizationAccessUserRoleDeniedMessage,
  resolveProviderFriendlyLabel,
} from "@/lib/core/organization-access-approval/labels";
import {
  normalizeOrganizationAccessProviderKey,
  resolveProviderAccessManifest,
  resolveScopesForCapability,
} from "@/lib/core/organization-access-approval/provider-scope-registry";
import type { OrganizationAccessOfferContext } from "@/lib/core/organization-access-approval/types";
import type { OrganizationExecutionKind } from "./organization-capability-resolution";

import {
  buildOrganizationAccessIntentHref,
  type OrganizationAccessIntentBinding,
} from "@/lib/core/organization-access-approval/access-intent-binding";

const SETTINGS_ROUTE = "/app/settings/organization-access";

export function buildOrganizationAccessIntentBinding(input: {
  intent: OrganizationAccessIntentBinding["intent"];
  offer: OrganizationAccessOfferContext;
  organization_id?: string | null;
  user_message_id?: string | null;
  ownership_type?: OrganizationAccessIntentBinding["ownership_type"];
  request_id?: string | null;
}): OrganizationAccessIntentBinding {
  return {
    intent: input.intent,
    provider_key: input.offer.provider_key,
    capability_key: input.offer.capability_key ?? null,
    ownership_type: input.ownership_type ?? "organization_owned_resource",
    organization_id: input.organization_id ?? null,
    user_message_id: input.user_message_id ?? null,
    request_id: input.request_id ?? null,
  };
}

/** State C — user lacks role permission; org provider approval does not elevate roles. */
export function buildOrganizationAccessUserRoleDeniedAnswer(input: {
  t: Translator;
  offer: OrganizationAccessOfferContext;
}): PlatformKnowledgeAnswer {
  const manifest = resolveProviderAccessManifest(input.offer.provider_key);
  const providerLabel = resolveProviderFriendlyLabel(input.t, input.offer.provider_key);
  const dataTypeLabel = manifest ? input.t(manifest.data_type_label_key) : null;

  return {
    directAnswer: buildOrganizationAccessUserRoleDeniedMessage(input.t),
    explanation: [
      dataTypeLabel
        ? input.t("customerApp.organizationAccessApproval.employee.userRoleDeniedContext").replace(
            "{dataType}",
            dataTypeLabel,
          )
        : null,
      input.t("customerApp.organizationAccessApproval.employee.providerContext").replace(
        "{provider}",
        providerLabel,
      ),
    ]
      .filter(Boolean)
      .join("\n\n"),
    steps: [],
    actions: [],
    sources: [],
    sourceId: "organization-access-user-role-denied",
    source: "customer_context",
    confidence: "moderate",
    showSupportEscalation: false,
    requestedLiveIntegration: false,
  };
}

export function buildOrganizationAccessRequiredAnswer(input: {
  t: Translator;
  offer: OrganizationAccessOfferContext;
  binding: OrganizationAccessIntentBinding;
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
  const createHref = buildOrganizationAccessIntentHref(SETTINGS_ROUTE, input.binding);

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
      href: action.id === "submit_access_request" ? createHref : SETTINGS_ROUTE,
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

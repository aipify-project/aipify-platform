import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import {
  resolveAuthorizationTargetFromQuery,
  type AuthorizationTargetResolution,
  type ProviderAuthorizationDescriptor,
} from "@/lib/core/authorization-target";
import { getMediaProviderManifest } from "@/lib/integration-intelligence/media/registry";
import { resolveProviderAccessManifest } from "@/lib/core/organization-access-approval/provider-scope-registry";
import {
  buildOrganizationAccessIntentHref,
  type OrganizationAccessIntentBinding,
} from "@/lib/core/organization-access-approval/access-intent-binding";

const SETTINGS_ROUTE = "/app/settings/organization-access";
const PERSONAL_INTEGRATIONS_ROUTE = "/app/settings/integrations";
const DEVICE_CENTER_ROUTE = "/app/settings/devices";

const BASE = "customerApp.authorizationTarget";

function resolveProviderLabel(t: Translator, providerKey: string | null): string {
  if (!providerKey) return t(`${BASE}.providers.generic.label`);
  const orgManifest = resolveProviderAccessManifest(providerKey);
  if (orgManifest) return t(orgManifest.provider_label_key);
  const mediaManifest = getMediaProviderManifest(providerKey);
  if (mediaManifest) return t(mediaManifest.display_name_key);
  return t(`${BASE}.providers.generic.label`);
}

function buildConnectActions(t: Translator, href: string) {
  return [
    {
      labelKey: `${BASE}.userOwned.actions.connect`,
      label: t(`${BASE}.userOwned.actions.connect`),
      href,
      routeKey: "authorizationTargetConnect",
      variant: "primary" as const,
    },
    {
      labelKey: `${BASE}.userOwned.actions.cancel`,
      label: t(`${BASE}.userOwned.actions.cancel`),
      href: PERSONAL_INTEGRATIONS_ROUTE,
      routeKey: "authorizationTargetCancel",
      variant: "secondary" as const,
    },
  ];
}

export function buildUserOwnedAccountConnectionAnswer(input: {
  t: Translator;
  target: AuthorizationTargetResolution;
  binding?: OrganizationAccessIntentBinding;
}): PlatformKnowledgeAnswer {
  const providerLabel = resolveProviderLabel(input.t, input.target.provider_key);
  const binding =
    input.binding ??
    ({
      intent: "connect",
      provider_key: input.target.provider_key ?? "personal_streaming_account",
      capability_key: input.target.capability_key,
      ownership_type: "user_owned_account",
      organization_id: null,
      user_message_id: null,
      request_id: null,
    } satisfies OrganizationAccessIntentBinding);

  return {
    directAnswer: input.t(`${BASE}.userOwned.connectLead`).replace("{provider}", providerLabel),
    explanation: input.t(`${BASE}.userOwned.connectExplanation`).replace("{provider}", providerLabel),
    steps: [],
    actions: buildConnectActions(
      input.t,
      buildOrganizationAccessIntentHref(PERSONAL_INTEGRATIONS_ROUTE, binding),
    ),
    sources: [],
    sourceId: "authorization-target-user-owned",
    source: "customer_context",
    confidence: "moderate",
    showSupportEscalation: false,
    requestedLiveIntegration: true,
  };
}

export function buildLocalDevicePermissionAnswer(input: {
  t: Translator;
  target: AuthorizationTargetResolution;
}): PlatformKnowledgeAnswer {
  const providerLabel = resolveProviderLabel(input.t, input.target.provider_key);
  return {
    directAnswer: input.t(`${BASE}.localDevice.permissionLead`),
    explanation: input.t(`${BASE}.localDevice.permissionExplanation`).replace(
      "{provider}",
      providerLabel,
    ),
    steps: [],
    actions: [
      {
        labelKey: `${BASE}.localDevice.actions.openSettings`,
        label: input.t(`${BASE}.localDevice.actions.openSettings`),
        href: DEVICE_CENTER_ROUTE,
        routeKey: "authorizationTargetDeviceSettings",
        variant: "primary" as const,
      },
      {
        labelKey: `${BASE}.localDevice.actions.cancel`,
        label: input.t(`${BASE}.localDevice.actions.cancel`),
        href: DEVICE_CENTER_ROUTE,
        routeKey: "authorizationTargetDeviceCancel",
        variant: "secondary" as const,
      },
    ],
    sources: [],
    sourceId: "authorization-target-local-device",
    source: "customer_context",
    confidence: "moderate",
    showSupportEscalation: false,
    requestedLiveIntegration: false,
  };
}

export function buildOrganizationAccessApproverDirectAnswer(input: {
  t: Translator;
  provider_key: string;
  binding: OrganizationAccessIntentBinding;
}): PlatformKnowledgeAnswer {
  const providerLabel = resolveProviderLabel(input.t, input.provider_key);
  const approveHref = buildOrganizationAccessIntentHref(SETTINGS_ROUTE, input.binding);
  return {
    directAnswer: input.t(`${BASE}.approver.directLead`),
    explanation: input.t(`${BASE}.approver.directExplanation`).replace("{provider}", providerLabel),
    steps: [],
    actions: [
      {
        labelKey: `${BASE}.approver.actions.approveAccess`,
        label: input.t(`${BASE}.approver.actions.approveAccess`),
        href: approveHref,
        routeKey: "organizationAccessApprovalApprove",
        variant: "primary" as const,
      },
      {
        labelKey: `${BASE}.approver.actions.cancel`,
        label: input.t(`${BASE}.approver.actions.cancel`),
        href: SETTINGS_ROUTE,
        routeKey: "organizationAccessApprovalCancel",
        variant: "secondary" as const,
      },
    ],
    sources: [],
    sourceId: "organization-access-approver-direct",
    source: "customer_context",
    confidence: "moderate",
    showSupportEscalation: false,
    requestedLiveIntegration: false,
  };
}

export function resolveAuthorizationTargetCompanionAnswer(
  query: string,
  input: {
    t: Translator;
    locale: CustomerActiveLocale;
    extraDescriptors?: readonly ProviderAuthorizationDescriptor[];
    userMessageId?: string | null;
    organizationId?: string | null;
  },
): PlatformSearchResult | null {
  const target = resolveAuthorizationTargetFromQuery(
    query,
    input.locale,
    input.extraDescriptors ?? [],
  );
  if (!target) return null;

  switch (target.ownership) {
    case "user_owned_account":
      return {
        answer: buildUserOwnedAccountConnectionAnswer({
          t: input.t,
          target,
          binding: {
            intent: "connect",
            provider_key: target.provider_key ?? "personal_streaming_account",
            capability_key: target.capability_key,
            ownership_type: "user_owned_account",
            organization_id: input.organizationId ?? null,
            user_message_id: input.userMessageId ?? null,
            request_id: null,
          },
        }),
      };
    case "local_device_permission":
      return { answer: buildLocalDevicePermissionAnswer({ t: input.t, target }) };
    default:
      return null;
  }
}

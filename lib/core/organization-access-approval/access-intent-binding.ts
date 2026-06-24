import type { AuthorizationResourceOwnership } from "@/lib/core/authorization-target/types";

export type OrganizationAccessPanelIntent = "create" | "approve" | "connect";

export type OrganizationAccessIntentBinding = {
  intent: OrganizationAccessPanelIntent;
  provider_key: string;
  capability_key: string | null;
  ownership_type: AuthorizationResourceOwnership | "provider_unavailable";
  organization_id: string | null;
  user_message_id: string | null;
  request_id: string | null;
};

const ORGANIZATION_OWNED: AuthorizationResourceOwnership = "organization_owned_resource";

/** Short-lived cookie used to pass intent query without embedding raw IDs in panel HTML. */
export const ORGANIZATION_ACCESS_INTENT_COOKIE = "aipify_oaa_intent";

export const ORGANIZATION_ACCESS_INTENT_QUERY_KEYS = [
  "intent",
  "provider",
  "capability",
  "ownership_type",
  "organization_id",
  "user_message_id",
  "request_id",
] as const;

export function hasOrganizationAccessIntentQuery(
  params: Record<string, string | string[] | undefined>,
): boolean {
  return ORGANIZATION_ACCESS_INTENT_QUERY_KEYS.some((key) => {
    const value = params[key];
    if (typeof value === "string") return value.length > 0;
    if (Array.isArray(value)) return value.some((entry) => entry.length > 0);
    return false;
  });
}

export function serializeOrganizationAccessIntentQuery(
  params: Record<string, string | string[] | undefined>,
): string {
  const qs = new URLSearchParams();
  for (const key of ORGANIZATION_ACCESS_INTENT_QUERY_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value) qs.set(key, value);
    else if (Array.isArray(value) && value[0]) qs.set(key, value[0]);
  }
  return qs.toString();
}

export function buildOrganizationAccessIntentSearchParams(
  binding: OrganizationAccessIntentBinding,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("intent", binding.intent);
  params.set("provider", binding.provider_key);
  if (binding.capability_key) params.set("capability", binding.capability_key);
  params.set("ownership_type", binding.ownership_type);
  if (binding.organization_id) params.set("organization_id", binding.organization_id);
  if (binding.user_message_id) params.set("user_message_id", binding.user_message_id);
  if (binding.request_id) params.set("request_id", binding.request_id);
  return params;
}

export function buildOrganizationAccessIntentHref(
  route: string,
  binding: OrganizationAccessIntentBinding,
): string {
  const params = buildOrganizationAccessIntentSearchParams(binding);
  return `${route}?${params.toString()}`;
}

export function parseOrganizationAccessIntentBinding(
  params: Pick<URLSearchParams, "get">,
): OrganizationAccessIntentBinding | null {
  const intent = params.get("intent");
  const providerKey = params.get("provider")?.trim();
  if (
    intent !== "create" &&
    intent !== "approve" &&
    intent !== "connect"
  ) {
    return null;
  }
  if (!providerKey) return null;

  const ownershipRaw = params.get("ownership_type");
  const ownership_type =
    ownershipRaw === "user_owned_account" ||
    ownershipRaw === "organization_owned_resource" ||
    ownershipRaw === "local_device_permission" ||
    ownershipRaw === "provider_unavailable"
      ? ownershipRaw
      : intent === "connect"
        ? "user_owned_account"
        : ORGANIZATION_OWNED;

  return {
    intent,
    provider_key: providerKey,
    capability_key: params.get("capability"),
    ownership_type,
    organization_id: params.get("organization_id"),
    user_message_id: params.get("user_message_id"),
    request_id: params.get("request_id"),
  };
}

export function organizationAccessIntentBindingsMatch(
  left: OrganizationAccessIntentBinding,
  right: OrganizationAccessIntentBinding,
): boolean {
  return (
    left.intent === right.intent &&
    left.provider_key === right.provider_key &&
    left.capability_key === right.capability_key &&
    left.ownership_type === right.ownership_type &&
    left.organization_id === right.organization_id &&
    left.user_message_id === right.user_message_id &&
    left.request_id === right.request_id
  );
}

export function buildOrganizationAccessIdempotencyKey(
  binding: OrganizationAccessIntentBinding,
): string {
  return [
    binding.intent,
    binding.provider_key,
    binding.capability_key ?? "",
    binding.ownership_type,
    binding.organization_id ?? "",
    binding.user_message_id ?? "",
  ].join(":");
}

export function buildOrganizationAccessContextPayload(
  binding: OrganizationAccessIntentBinding,
): Record<string, unknown> {
  return {
    access_intent: binding.intent,
    ownership_type: binding.ownership_type,
    capability_key: binding.capability_key,
    organization_id: binding.organization_id,
    user_message_id: binding.user_message_id,
    request_id: binding.request_id,
  };
}

export function isOrganizationAccessCreateBinding(
  binding: OrganizationAccessIntentBinding,
): boolean {
  return (
    binding.intent === "create" &&
    binding.ownership_type === ORGANIZATION_OWNED
  );
}

export function isOrganizationAccessApproveBinding(
  binding: OrganizationAccessIntentBinding,
): boolean {
  return (
    binding.intent === "approve" &&
    binding.ownership_type === ORGANIZATION_OWNED
  );
}

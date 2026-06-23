import type { CompanionExternalProviderHandoff } from "./types";

/** Registered external creative providers — adapters live outside Core. */
const REGISTERED_EXTERNAL_PROVIDER_ADAPTERS = new Set<string>([
  // No production adapters registered yet — honest adapter_missing until wired.
]);

export function classifyExternalProviderHandoff(input: {
  provider_key: string;
  consent_granted: boolean;
  permission_granted: boolean;
}): CompanionExternalProviderHandoff {
  const providerKey = input.provider_key.trim().toLowerCase();
  if (!providerKey) {
    return {
      provider_key: "unknown",
      status: "adapter_missing",
      requires_explicit_consent: true,
      message_key: "attachments.externalHandoff.adapterMissing",
    };
  }

  if (!input.permission_granted) {
    return {
      provider_key: providerKey,
      status: "permission_denied",
      requires_explicit_consent: true,
      message_key: "attachments.externalHandoff.permissionDenied",
    };
  }

  if (!REGISTERED_EXTERNAL_PROVIDER_ADAPTERS.has(providerKey)) {
    return {
      provider_key: providerKey,
      status: "adapter_missing",
      requires_explicit_consent: true,
      message_key: "attachments.externalHandoff.adapterMissing",
    };
  }

  if (!input.consent_granted) {
    return {
      provider_key: providerKey,
      status: "consent_required",
      requires_explicit_consent: true,
      message_key: "attachments.externalHandoff.consentRequired",
    };
  }

  return {
    provider_key: providerKey,
    status: "adapter_available",
    requires_explicit_consent: false,
    message_key: "attachments.externalHandoff.ready",
  };
}

export function listMissingExternalProviderAdapters(): readonly string[] {
  return [];
}

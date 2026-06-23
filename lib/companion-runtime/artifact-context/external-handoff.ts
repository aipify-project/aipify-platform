import type { CompanionExternalProviderHandoff } from "./types";
import {
  getExternalArtifactHandoffProviderReadiness,
  isExternalArtifactHandoffProviderRegistered,
} from "@/lib/integration-intelligence/external-artifact-handoff/registry";

export function classifyExternalProviderHandoff(input: {
  provider_key: string;
  consent_granted: boolean;
  permission_granted: boolean;
  connection_connected?: boolean;
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

  if (!isExternalArtifactHandoffProviderRegistered(providerKey)) {
    return {
      provider_key: providerKey,
      status: "adapter_missing",
      requires_explicit_consent: true,
      message_key: "attachments.externalHandoff.adapterMissing",
    };
  }

  const readiness = getExternalArtifactHandoffProviderReadiness(
    providerKey,
    input.connection_connected === true,
  );

  if (readiness === "partial") {
    return {
      provider_key: providerKey,
      status: "partial",
      requires_explicit_consent: true,
      message_key: "attachments.externalHandoff.partial",
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

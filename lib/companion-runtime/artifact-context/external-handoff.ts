import type { ExternalApplicationReadiness } from "../external-application-orchestration";
import { classifyExternalApplicationHandoff } from "../external-application-orchestration";
import type { CompanionExternalProviderHandoff } from "./types";

export function classifyExternalProviderHandoff(input: {
  provider_key: string;
  consent_granted: boolean;
  permission_granted: boolean;
  connection_connected?: boolean;
  adapter_registered: boolean;
  readiness: ExternalApplicationReadiness;
  operation_supported?: boolean;
}): CompanionExternalProviderHandoff {
  const result = classifyExternalApplicationHandoff({
    application_key: input.provider_key,
    adapter_registered: input.adapter_registered,
    readiness: input.readiness,
    consent_granted: input.consent_granted,
    permission_granted: input.permission_granted,
    connection_connected: input.connection_connected,
    operation_supported: input.operation_supported,
  });

  return {
    provider_key: result.application_key,
    status: result.status,
    requires_explicit_consent: result.requires_explicit_consent,
    message_key: result.message_key.replace(/^externalApplications\./, "attachments."),
  };
}

export function listMissingExternalProviderAdapters(): readonly string[] {
  return [];
}

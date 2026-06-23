import type {
  ExternalApplicationHandoffClassification,
  ExternalApplicationReadiness,
} from "./types";

function mapReadinessToHandoffStatus(input: {
  readiness: ExternalApplicationReadiness;
  connection_connected: boolean;
  consent_granted: boolean;
}): ExternalApplicationHandoffClassification["status"] {
  if (input.readiness === "adapter_missing" || input.readiness === "specification_only") {
    return "adapter_missing";
  }

  if (input.readiness === "partial" && !input.connection_connected) {
    return "partial";
  }

  if (!input.consent_granted) {
    return "consent_required";
  }

  return "adapter_available";
}

export function classifyExternalApplicationHandoff(input: {
  application_key: string;
  adapter_registered: boolean;
  readiness: ExternalApplicationReadiness;
  consent_granted: boolean;
  permission_granted: boolean;
  connection_connected?: boolean;
  operation_supported?: boolean;
}): ExternalApplicationHandoffClassification {
  const applicationKey = input.application_key.trim().toLowerCase();
  if (!applicationKey) {
    return {
      application_key: "unknown",
      status: "adapter_missing",
      requires_explicit_consent: true,
      message_key: "externalApplications.handoff.adapterMissing",
    };
  }

  if (input.operation_supported === false) {
    return {
      application_key: applicationKey,
      status: "unsupported",
      requires_explicit_consent: true,
      message_key: "externalApplications.handoff.unsupported",
    };
  }

  if (!input.permission_granted) {
    return {
      application_key: applicationKey,
      status: "permission_denied",
      requires_explicit_consent: true,
      message_key: "externalApplications.handoff.permissionDenied",
    };
  }

  if (!input.adapter_registered) {
    return {
      application_key: applicationKey,
      status: "adapter_missing",
      requires_explicit_consent: true,
      message_key: "externalApplications.handoff.adapterMissing",
    };
  }

  const status = mapReadinessToHandoffStatus({
    readiness: input.readiness,
    connection_connected: input.connection_connected === true,
    consent_granted: input.consent_granted,
  });

  const messageKey =
    status === "consent_required"
      ? "externalApplications.handoff.consentRequired"
      : status === "permission_denied"
        ? "externalApplications.handoff.permissionDenied"
        : status === "partial"
          ? "externalApplications.handoff.partial"
          : status === "unsupported"
            ? "externalApplications.handoff.unsupported"
            : status === "adapter_available"
              ? "externalApplications.handoff.ready"
              : "externalApplications.handoff.adapterMissing";

  return {
    application_key: applicationKey,
    status,
    requires_explicit_consent: status !== "adapter_available",
    message_key: messageKey,
  };
}

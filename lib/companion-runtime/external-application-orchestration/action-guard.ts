import type {
  ExternalApplicationActionResult,
  ExternalApplicationCapabilityStatus,
  ExternalApplicationHandoffClassification,
  ExternalApplicationOperation,
} from "./types";

export function buildBlockedExternalApplicationActionResult(input: {
  application_key: string;
  operation: ExternalApplicationOperation;
  capability_status: ExternalApplicationCapabilityStatus;
  failure_code: string;
}): ExternalApplicationActionResult {
  return {
    ok: false,
    reported_as_executed: false,
    capability_status: input.capability_status,
    application_key: input.application_key,
    operation: input.operation,
    external_reference: null,
    open_url: null,
    edit_url: null,
    failure_code: input.failure_code,
    audited: false,
  };
}

export function assertExternalApplicationActionMayProceed(input: {
  handoff: ExternalApplicationHandoffClassification;
}): ExternalApplicationActionResult | null {
  if (input.handoff.status === "adapter_missing") {
    return buildBlockedExternalApplicationActionResult({
      application_key: input.handoff.application_key,
      operation: "handoff",
      capability_status: "adapter_missing",
      failure_code: "adapter_missing",
    });
  }

  if (input.handoff.status === "permission_denied") {
    return buildBlockedExternalApplicationActionResult({
      application_key: input.handoff.application_key,
      operation: "handoff",
      capability_status: "permission_required",
      failure_code: "permission_denied",
    });
  }

  if (input.handoff.status === "partial" || input.handoff.status === "unsupported") {
    return buildBlockedExternalApplicationActionResult({
      application_key: input.handoff.application_key,
      operation: "handoff",
      capability_status: input.handoff.status === "unsupported" ? "unsupported" : "partial",
      failure_code: input.handoff.status,
    });
  }

  if (input.handoff.status === "consent_required") {
    return buildBlockedExternalApplicationActionResult({
      application_key: input.handoff.application_key,
      operation: "handoff",
      capability_status: "partial",
      failure_code: "consent_required",
    });
  }

  return null;
}

export function finalizeExternalApplicationActionResult(
  result: ExternalApplicationActionResult,
): ExternalApplicationActionResult {
  if (!result.ok) {
    return { ...result, reported_as_executed: false };
  }

  if (!result.external_reference && !result.open_url && !result.edit_url) {
    return {
      ...result,
      ok: false,
      reported_as_executed: false,
      failure_code: result.failure_code ?? "missing_provider_reference",
    };
  }

  return {
    ...result,
    reported_as_executed: true,
  };
}

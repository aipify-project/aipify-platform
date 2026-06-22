import { executeAction, getExecutionAdapter } from "@/lib/aipify/execution/adapters";
import type { AdapterResult } from "@/lib/aipify/execution/types";
import { sanitizeToolOutput } from "./companion-tool-definition";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { resolveWriteAdapterKey } from "./companion-action-execution-gate";

const SECRET_FIELD_PATTERN =
  /password|secret|token|credential|api_key|private_key|auth_header|bearer/i;

export type CompanionWriteDispatchResult =
  | {
      ok: true;
      adapter_key: string;
      result: Record<string, unknown>;
      rollback_available: boolean;
      partial: boolean;
      warnings: string[];
    }
  | {
      ok: false;
      code: "missing_adapter" | "invalid_output" | "provider_failure" | "validation_failed";
      message: string;
    };

function sanitizeExecutionPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return sanitizeToolOutput(payload) as Record<string, unknown>;
}

function sanitizeExecutionResult(result: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(result)) {
    if (SECRET_FIELD_PATTERN.test(key)) continue;
    if (typeof value === "string" && SECRET_FIELD_PATTERN.test(value)) continue;
    sanitized[key] = value;
  }
  return sanitized;
}

function adapterResultToRecord(
  adapterKey: string,
  adapterResult: AdapterResult,
): Record<string, unknown> {
  return sanitizeExecutionResult({
    adapter_key: adapterKey,
    executed: adapterResult.executed ?? false,
    message: adapterResult.message ?? "",
    preview: adapterResult.preview ?? "",
    rollback: adapterResult.rollback ?? false,
    valid: adapterResult.valid,
  });
}

export function dispatchCompanionWriteAction(
  definition: CompanionActionDefinition,
  validatedInput: Record<string, unknown>,
): CompanionWriteDispatchResult {
  const adapterKey = resolveWriteAdapterKey(definition.action_id);
  if (!adapterKey) {
    return { ok: false, code: "missing_adapter", message: "No write adapter registered for action." };
  }

  const adapter = getExecutionAdapter(adapterKey);
  if (!adapter) {
    return { ok: false, code: "missing_adapter", message: "Write adapter unavailable." };
  }

  const payload = sanitizeExecutionPayload({
    ...validatedInput,
    action_id: definition.action_id,
    capability_id: definition.capability_id,
    provider_key: definition.provider_key,
    entity: definition.entity,
  });

  const validation = adapter.validate(payload);
  if (!validation.valid) {
    return {
      ok: false,
      code: "validation_failed",
      message: validation.message ?? "Adapter validation failed.",
    };
  }

  try {
    const execution = adapter.execute(payload);
    if (!execution.valid) {
      return {
        ok: false,
        code: "provider_failure",
        message: execution.message ?? "Provider adapter failed.",
      };
    }

    const partial = Boolean(execution.message?.toLowerCase().includes("partial"));
    const warnings = partial ? ["partial_success"] : [];

    return {
      ok: true,
      adapter_key: adapterKey,
      result: adapterResultToRecord(adapterKey, execution),
      rollback_available: Boolean(execution.rollback ?? definition.reversible),
      partial,
      warnings,
    };
  } catch (error) {
    return {
      ok: false,
      code: "provider_failure",
      message: error instanceof Error ? error.message : "Provider adapter failure.",
    };
  }
}

export function rollbackCompanionWriteAction(
  definition: CompanionActionDefinition,
  validatedInput: Record<string, unknown>,
): CompanionWriteDispatchResult {
  const adapterKey = resolveWriteAdapterKey(definition.action_id);
  if (!adapterKey) {
    return { ok: false, code: "missing_adapter", message: "No rollback adapter available." };
  }

  const adapter = getExecutionAdapter(adapterKey);
  if (!adapter?.rollback) {
    return { ok: false, code: "provider_failure", message: "Rollback not supported." };
  }

  const payload = sanitizeExecutionPayload(validatedInput);
  const rollback = adapter.rollback(payload);
  if (!rollback.valid) {
    return {
      ok: false,
      code: "provider_failure",
      message: rollback.message ?? "Rollback failed.",
    };
  }

  return {
    ok: true,
    adapter_key: adapterKey,
    result: adapterResultToRecord(adapterKey, rollback),
    rollback_available: false,
    partial: false,
    warnings: [],
  };
}

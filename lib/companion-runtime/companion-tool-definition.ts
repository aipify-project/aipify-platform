import type { IntegrationCapabilityKey } from "@/lib/integration-intelligence/types";

export type CompanionToolFreshness = "unknown" | "fresh" | "stale";

export type CompanionToolSchemaField = {
  name: string;
  type: "string" | "boolean" | "number" | "object" | "array";
  required?: boolean;
};

export type CompanionToolSchema = {
  fields: CompanionToolSchemaField[];
};

export type CompanionToolDefinition = {
  tool_id: string;
  capability_id: string;
  provider_key: string;
  operation: "read";
  access_mode: "read";
  required_permission: string | null;
  input_schema: CompanionToolSchema;
  output_schema: CompanionToolSchema;
  source_label: string;
  freshness: CompanionToolFreshness;
  approval_required: boolean;
  enabled: boolean;
};

export type CompanionToolRegistry = {
  tools: CompanionToolDefinition[];
  enabledTools: CompanionToolDefinition[];
};

const FORBIDDEN_FIELD_PATTERN =
  /password|secret|token|credential|api_key|private_key|auth_header|bearer/i;

const READ_INTEGRATION_CAPABILITIES = new Set<IntegrationCapabilityKey>([
  "platform_snapshot",
  "connection_status",
]);

export function buildProviderCapabilityId(
  providerKey: string,
  capabilityKey: IntegrationCapabilityKey,
): string {
  return `${providerKey}.${capabilityKey}.read`;
}

export function buildProviderToolId(
  providerKey: string,
  capabilityKey: IntegrationCapabilityKey,
): string {
  return `${providerKey}:${capabilityKey}`;
}

export function parseProviderCapabilityId(capabilityId: string): {
  providerKey: string;
  capabilityKey: IntegrationCapabilityKey;
  operation: string;
} | null {
  const parts = capabilityId.split(".").filter(Boolean);
  if (parts.length < 3) return null;
  const operation = parts[parts.length - 1] ?? "";
  const capabilityKey = parts[parts.length - 2] as IntegrationCapabilityKey;
  const providerKey = parts.slice(0, -2).join(".");
  if (!providerKey || !READ_INTEGRATION_CAPABILITIES.has(capabilityKey)) return null;
  return { providerKey, capabilityKey, operation };
}

export function buildReadToolInputSchema(): CompanionToolSchema {
  return {
    fields: [
      { name: "providerKey", type: "string", required: true },
      { name: "refresh", type: "boolean" },
    ],
  };
}

export function buildReadToolOutputSchema(fields: readonly string[]): CompanionToolSchema {
  return {
    fields: fields.map((name) => ({ name, type: "string" as const })),
  };
}

export function createEmptyCompanionToolRegistry(
  overrides?: Partial<CompanionToolRegistry>,
): CompanionToolRegistry {
  return {
    tools: [],
    enabledTools: [],
    ...overrides,
  };
}

export function validateToolInput(
  tool: CompanionToolDefinition,
  input: Record<string, unknown>,
): { ok: true } | { ok: false; code: "invalid_input" } {
  for (const field of tool.input_schema.fields) {
    if (!field.required) continue;
    const value = input[field.name];
    if (value === undefined || value === null || value === "") {
      return { ok: false, code: "invalid_input" };
    }
  }

  if (typeof input.providerKey === "string" && input.providerKey !== tool.provider_key) {
    return { ok: false, code: "invalid_input" };
  }

  return { ok: true };
}

export function sanitizeToolOutput(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (FORBIDDEN_FIELD_PATTERN.test(key)) continue;
    if (typeof value === "string" && FORBIDDEN_FIELD_PATTERN.test(value)) continue;
    sanitized[key] = value;
  }
  return sanitized;
}

export function validateToolOutput(
  tool: CompanionToolDefinition,
  output: Record<string, unknown>,
): { ok: true } | { ok: false; code: "invalid_output" } {
  const allowed = new Set(tool.output_schema.fields.map((field) => field.name));
  for (const key of Object.keys(output)) {
    if (FORBIDDEN_FIELD_PATTERN.test(key)) {
      return { ok: false, code: "invalid_output" };
    }
    if (!allowed.has(key) && key !== "provider" && key !== "checked_at" && key !== "source") {
      continue;
    }
  }
  return { ok: true };
}

export function selectToolByCapabilityId(
  registry: CompanionToolRegistry,
  capabilityId: string,
): CompanionToolDefinition | null {
  return registry.enabledTools.find((tool) => tool.capability_id === capabilityId) ?? null;
}

export function capabilityIdForCompanionLiveTool(
  providerKey: string,
  toolName: "get_platform_snapshot" | "get_connection_status",
): string {
  return toolName === "get_platform_snapshot"
    ? buildProviderCapabilityId(providerKey, "platform_snapshot")
    : buildProviderCapabilityId(providerKey, "connection_status");
}

export function isReadIntegrationCapability(capabilityKey: string): capabilityKey is IntegrationCapabilityKey {
  return READ_INTEGRATION_CAPABILITIES.has(capabilityKey as IntegrationCapabilityKey);
}

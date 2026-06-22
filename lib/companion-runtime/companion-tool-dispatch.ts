import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { IntegrationStatusToolResult } from "@/lib/companion-platform-knowledge/integration-status-tool";
import type { PlatformSnapshotToolResult } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import {
  parseProviderCapabilityId,
  sanitizeToolOutput,
  validateToolInput,
  validateToolOutput,
  type CompanionToolDefinition,
  type CompanionToolFreshness,
} from "./companion-tool-definition";
import { resolveProviderReadToolInvoker } from "./provider-live-tools";

function toRecord(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};
  return data as Record<string, unknown>;
}

export type CompanionToolDispatchResult =
  | {
      ok: true;
      data: Record<string, unknown>;
      tool: CompanionToolDefinition;
      freshness: CompanionToolFreshness;
      platformSnapshot?: PlatformSnapshotToolResult;
      connectionStatus?: IntegrationStatusToolResult;
    }
  | {
      ok: false;
      code: string;
      gap: boolean;
      tool?: CompanionToolDefinition;
      platformSnapshot?: PlatformSnapshotToolResult;
      connectionStatus?: IntegrationStatusToolResult;
    };


export async function dispatchCompanionReadTool(
  supabase: SupabaseClient,
  tool: CompanionToolDefinition,
  input: Record<string, unknown> = {},
): Promise<CompanionToolDispatchResult> {
  if (!tool.enabled || tool.access_mode !== "read" || tool.operation !== "read") {
    return { ok: false, code: "capability_denied", gap: true, tool };
  }

  if (tool.approval_required) {
    return { ok: false, code: "approval_required", gap: true, tool };
  }

  const inputValidation = validateToolInput(tool, {
    providerKey: tool.provider_key,
    refresh: input.refresh === true,
    ...input,
  });
  if (!inputValidation.ok) {
    return { ok: false, code: inputValidation.code, gap: true, tool };
  }

  const parsed = parseProviderCapabilityId(tool.capability_id);
  if (!parsed || parsed.operation !== "read") {
    return { ok: false, code: "unknown_capability", gap: true, tool };
  }

  const invoker = resolveProviderReadToolInvoker(parsed.providerKey, parsed.capabilityKey);
  if (!invoker) {
    return { ok: false, code: "tool_unavailable", gap: true, tool };
  }

  const rawResult = await invoker(supabase, {
    providerKey: tool.provider_key,
    refresh: input.refresh === true,
  });

  if (!rawResult) {
    return { ok: false, code: "tool_unavailable", gap: true, tool };
  }

  if (!rawResult.ok) {
    return {
      ok: false,
      code: rawResult.code,
      gap: false,
      tool,
      platformSnapshot:
        parsed.capabilityKey === "platform_snapshot"
          ? (rawResult as PlatformSnapshotToolResult)
          : undefined,
      connectionStatus:
        parsed.capabilityKey === "connection_status"
          ? (rawResult as IntegrationStatusToolResult)
          : undefined,
    };
  }

  const sanitized = sanitizeToolOutput(toRecord(rawResult.data));
  const outputValidation = validateToolOutput(tool, sanitized);
  if (!outputValidation.ok) {
    return { ok: false, code: outputValidation.code, gap: true, tool };
  }

  return {
    ok: true,
    data: sanitized,
    tool,
    freshness: tool.freshness,
    platformSnapshot:
      parsed.capabilityKey === "platform_snapshot"
        ? (rawResult as PlatformSnapshotToolResult)
        : undefined,
    connectionStatus:
      parsed.capabilityKey === "connection_status"
        ? (rawResult as IntegrationStatusToolResult)
        : undefined,
  };
}

export async function dispatchCompanionReadToolByCapabilityId(
  supabase: SupabaseClient,
  tools: CompanionToolDefinition[],
  capabilityId: string,
  input: Record<string, unknown> = {},
): Promise<CompanionToolDispatchResult> {
  const tool = tools.find((entry) => entry.capability_id === capabilityId && entry.enabled) ?? null;
  if (!tool) {
    return { ok: false, code: "missing_tool", gap: true };
  }
  return dispatchCompanionReadTool(supabase, tool, input);
}

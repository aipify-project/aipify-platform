import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  normalizeCompanionMemoryContext,
  parseMemoryRpcPayloads,
  type CompanionMemoryContext,
} from "./companion-memory-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

export async function loadCompanionMemoryContext(
  supabase: SupabaseClient,
  options?: { query?: string; locale?: string },
): Promise<{ memoryContext: CompanionMemoryContext; confirmedOrganizationKnowledgeAvailable: boolean }> {
  const query = options?.query?.trim() ?? "";

  const requests = await Promise.all([
    (async () => {
      const { data, error } = await supabase.rpc("search_organization_memory_records", {
        p_query: query || "",
        p_category: null,
        p_status: "active",
        p_limit: 20,
      });
      return { kind: "memory" as const, data, error: error?.message ?? null };
    })(),
    (async () => {
      const { data, error } = await supabase.rpc("get_customer_learning_center");
      return { kind: "learning" as const, data, error: error?.message ?? null };
    })(),
    (async () => {
      if (!query) {
        return { kind: "knowledge" as const, data: [], error: null };
      }
      const { data, error } = await supabase.rpc("search_organization_knowledge", {
        p_filters: { query, limit: 5, status: "published" },
      });
      return { kind: "knowledge" as const, data, error: error?.message ?? null };
    })(),
    (async () => {
      const { data, error } = await supabase.rpc("get_organization_memory_center", {
        p_section: "preferences",
      });
      return { kind: "center" as const, data, error: error?.message ?? null };
    })(),
  ]);

  let organizationMemoryRaw: unknown = [];
  let learningCenterRaw: unknown = null;
  let organizationKnowledgeRaw: unknown = [];
  let memoryCenterRaw: unknown = null;
  let permissionDenied = false;

  for (const result of requests) {
    if (result.error && isPermissionDeniedMessage(result.error)) {
      permissionDenied = true;
      continue;
    }
    if (result.kind === "memory") organizationMemoryRaw = result.data;
    if (result.kind === "learning") learningCenterRaw = result.data;
    if (result.kind === "knowledge") organizationKnowledgeRaw = result.data;
    if (result.kind === "center") memoryCenterRaw = result.data;
  }

  const parsed = parseMemoryRpcPayloads({
    organizationMemoryRaw,
    learningCenterRaw,
    organizationKnowledgeRaw,
    memoryCenterRaw,
  });

  const memoryContext = normalizeCompanionMemoryContext({
    organizationMemoryRecords: parsed.organizationMemoryRecords,
    learningCenter: parsed.learningCenter,
    organizationKnowledgeHits: parsed.organizationKnowledgeHits,
    memoryCenterPreferences: parsed.memoryCenterPreferences,
    permissionDenied,
  });

  const confirmedOrganizationKnowledgeAvailable =
    !permissionDenied && memoryContext.confirmed_knowledge.length > 0;

  return { memoryContext, confirmedOrganizationKnowledgeAvailable };
}

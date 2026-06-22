import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  canAccessCommandBrief,
  canAccessSinceLastLogin,
  createEmptyCompanionOperationalContext,
  isOperationalAppSuspended,
  normalizeCompanionOperationalContext,
  parseOperationalRpcPayloads,
  type CompanionOperationalContext,
} from "./companion-operational-context";

export type CompanionOperationalLoadResult = {
  operationalContext: CompanionOperationalContext;
  commandBriefAvailable: boolean;
  sinceLastLoginAvailable: boolean;
};

export type LoadCompanionOperationalInput = {
  effectivePermissions: string[];
  subscriptionStatus: string | null;
  enabledModules: string[];
  activeBusinessPacks: string[];
};

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

export async function loadCompanionOperationalContext(
  supabase: SupabaseClient,
  input: LoadCompanionOperationalInput,
): Promise<CompanionOperationalLoadResult> {
  const appSuspended = isOperationalAppSuspended(input.subscriptionStatus);
  const commandBriefPermitted = canAccessCommandBrief(input.effectivePermissions);
  const sinceLastPermitted = canAccessSinceLastLogin(input.effectivePermissions);

  if (appSuspended) {
    return {
      operationalContext: createEmptyCompanionOperationalContext({ warnings: ["app_suspended"] }),
      commandBriefAvailable: false,
      sinceLastLoginAvailable: false,
    };
  }

  if (!commandBriefPermitted && !sinceLastPermitted) {
    return {
      operationalContext: createEmptyCompanionOperationalContext({ warnings: ["permission_denied"] }),
      commandBriefAvailable: false,
      sinceLastLoginAvailable: false,
    };
  }

  const requests: Array<Promise<{ kind: "executive" | "activity" | "briefing"; data: unknown; error: string | null }>> =
    [];

  if (commandBriefPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_organization_executive_command_center", {
          p_section: "overview",
        });
        return { kind: "executive" as const, data, error: error?.message ?? null };
      })(),
      (async () => {
        const { data, error } = await supabase.rpc("get_companion_context_briefing", {
          p_context: "command_center",
        });
        return { kind: "briefing" as const, data, error: error?.message ?? null };
      })(),
    );
  }

  if (sinceLastPermitted) {
    requests.push(
      (async () => {
        const { data, error } = await supabase.rpc("get_activity_operations_center", {
          p_section: null,
        });
        return { kind: "activity" as const, data, error: error?.message ?? null };
      })(),
    );
  }

  const results = await Promise.all(requests);
  let executiveRaw: unknown = null;
  let activityRaw: unknown = null;
  let briefingRaw: unknown = null;
  let permissionDenied = false;

  for (const result of results) {
    if (result.error && isPermissionDeniedMessage(result.error)) {
      permissionDenied = true;
      continue;
    }
    if (result.kind === "executive") executiveRaw = result.data;
    if (result.kind === "activity") activityRaw = result.data;
    if (result.kind === "briefing") briefingRaw = result.data;
  }

  const parsed = parseOperationalRpcPayloads({
    executiveRaw,
    activityRaw,
    briefingRaw,
  });

  const commandBriefAvailable =
    commandBriefPermitted &&
    !permissionDenied &&
    Boolean(parsed.executiveCenter?.found || parsed.commandBriefing?.has_customer);

  const sinceLastLoginAvailable =
    sinceLastPermitted &&
    !permissionDenied &&
    Boolean(parsed.activityCenter?.found && parsed.activityCenter.since_last_login);

  return {
    operationalContext: normalizeCompanionOperationalContext({
      executiveCenter: parsed.executiveCenter,
      activityCenter: parsed.activityCenter,
      commandBriefing: parsed.commandBriefing,
      enabledModules: input.enabledModules,
      activeBusinessPacks: input.activeBusinessPacks,
      permissionDenied,
      appSuspended,
    }),
    commandBriefAvailable,
    sinceLastLoginAvailable,
  };
}

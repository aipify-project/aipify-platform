import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveCompanionLiveToolRouting } from "@/lib/companion-platform-knowledge/live-routing";
import {
  buildOrganizationConnectionStatusPermissionDeniedAnswer,
  buildOrganizationConnectionStatusSummaryAnswer,
} from "@/lib/companion-platform-knowledge/organization-connection-status-answer";
import {
  canViewOrganizationConnectionStatus,
  isOrganizationConnectionStatusQuery,
} from "@/lib/companion-platform-knowledge/organization-connection-status-intent";
import type { PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PermissionContext } from "@/lib/companion-platform-knowledge/permission-gate";
import { matchLiveQuery } from "./companion-query-match";
import type { CompanionTenantContext } from "./companion-tenant-context";
import { dispatchCompanionReadTool } from "./companion-tool-dispatch";
import { selectToolByCapabilityId } from "./companion-tool-definition";
import { buildGroundedLiveAnswer, buildGroundedLiveFailureAnswer, buildGroundedLiveGapAnswer } from "./grounded-answer";
import { mapDispatchCodeToGapReason } from "./tool-answer";
import { normalizeCompanionLiveResult } from "./companion-live-result";

async function executeOrganizationConnectionLiveRead(
  supabase: SupabaseClient,
  tenantContext: CompanionTenantContext,
  liveMatch: NonNullable<ReturnType<typeof matchLiveQuery>>,
  t: Translator,
  locale: CustomerActiveLocale,
): Promise<PlatformSearchResult> {
  const tool = selectToolByCapabilityId(tenantContext.toolRegistry, liveMatch.capability_id);
  if (!tool) {
    return { answer: buildGroundedLiveGapAnswer(t, "missing_tool") };
  }

  const dispatchResult = await dispatchCompanionReadTool(supabase, tool, {
    providerKey: liveMatch.provider_key,
    refresh: true,
  });

  if (!dispatchResult.ok && dispatchResult.gap) {
    return {
      answer: buildGroundedLiveGapAnswer(t, mapDispatchCodeToGapReason(dispatchResult.code)),
    };
  }

  if (!dispatchResult.ok) {
    return { answer: buildGroundedLiveFailureAnswer(t, dispatchResult.code) };
  }

  const liveResult = normalizeCompanionLiveResult(dispatchResult, liveMatch);
  return {
    answer: buildGroundedLiveAnswer(liveResult, liveMatch, t, locale),
  };
}

/** Organization/integration connection status — evaluated before community/moderation routing. */
export async function resolveOrganizationConnectionStatusAnswer(
  query: string,
  input: {
    t: Translator;
    tenantContext: CompanionTenantContext;
    supabase: SupabaseClient | null | undefined;
    activeLocale: CustomerActiveLocale;
    permissionCtx: PermissionContext;
    integrationContext: string | null;
  },
): Promise<PlatformSearchResult | null> {
  if (!isOrganizationConnectionStatusQuery(query)) return null;

  if (!canViewOrganizationConnectionStatus(input.tenantContext)) {
    return {
      answer: buildOrganizationConnectionStatusPermissionDeniedAnswer(input.t),
    };
  }

  const providerKey =
    input.integrationContext ??
    input.tenantContext.primaryVerifiedProvider ??
    input.tenantContext.connectedProviders[0] ??
    null;

  if (input.supabase && providerKey) {
    const liveRouting = resolveCompanionLiveToolRouting(query, {
      integrationContext: providerKey,
      locale: input.activeLocale,
    });

    const liveMatch = matchLiveQuery({
      query,
      tenantContext: input.tenantContext,
      integrationContext: providerKey,
      locale: input.activeLocale,
      liveRouting,
    });

    if (liveMatch) {
      return executeOrganizationConnectionLiveRead(
        input.supabase,
        input.tenantContext,
        liveMatch,
        input.t,
        input.activeLocale,
      );
    }
  }

  return {
    answer: buildOrganizationConnectionStatusSummaryAnswer({
      connectedProviders: input.tenantContext.connectedProviders,
      primaryVerifiedProvider: input.tenantContext.primaryVerifiedProvider,
      t: input.t,
      permissionCtx: input.permissionCtx,
    }),
  };
}

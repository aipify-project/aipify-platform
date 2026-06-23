import {
  answerToLegacyArticle,
  resolveAnswerLocale,
  searchPlatformKnowledge,
  trackLowConfidenceQuery,
} from "@/lib/companion-platform-knowledge";
import {
  buildSupportAssistantCorpus,
  buildSupportAssistantLabels,
  getSupportAssistantArticleById,
} from "@/lib/app-portal/support-assistant";
import {
  buildPlatformSearchContextFromTenant,
  loadCompanionTenantContext,
  resolveCompanionIntegrationContext,
} from "@/lib/companion-runtime/tenant-context";
import { loadCompanionArtifactContext } from "@/lib/companion-runtime/artifact-context/server";
import { classifyExternalProviderHandoffFromRegistry } from "@/lib/integration-intelligence/external-applications/handoff-bridge";
import { loadCanvaHandoffConnectionMaterial } from "@/lib/integration-intelligence/external-artifact-handoff/server";
import { assertCanvaHandoffPermissionForRole } from "@/lib/integration-intelligence/providers/canva/permissions";
import { enrichAnswerWithArtifactContext } from "@/lib/companion-runtime/artifact-context/enrich-answer";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildReplyFromSearchJson } from "./build-reply";
import type { CompanionExperienceLabels } from "../types";
import type { WorkerExecutionProfile } from "./load-worker-profile";
import { bootstrapCompanionWorkerTenantRuntime } from "./load-worker-tenant-context";

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.replace(/^customerApp\./, "").split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function getSearchTermsArray(dict: Record<string, unknown>, key: string): string[] {
  const raw = getNestedValue(dict, key);
  if (typeof raw === "string") {
    return raw.split("|").map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(raw)) return raw.map(String);
  return [];
}

export type ExecuteCompanionTurnInput = {
  query: string;
  locale: string;
  conversationId: string;
  activeArtifactId?: string | null;
  attachmentIds?: string[];
  platformActiveModules?: string[];
  integrationContext?: string | null;
  externalProvider?: string | null;
  externalConsent?: boolean;
  /** Background worker execution — uses queue tenant/user instead of auth session. */
  workerProfile?: WorkerExecutionProfile;
};

export type ExecuteCompanionTurnResult =
  | {
      ok: true;
      searchJson: Record<string, unknown>;
      labels: CompanionExperienceLabels;
      question: string;
    }
  | { ok: false; error: string; code?: string };

export async function executeCompanionTurn(
  supabase: SupabaseClient,
  input: ExecuteCompanionTurnInput,
): Promise<ExecuteCompanionTurnResult> {
  const query = input.query.trim();
  if (!query && !(input.attachmentIds?.length ?? 0)) {
    return { ok: false, error: "empty_query", code: "empty_query" };
  }

  const profile = input.workerProfile
    ? {
        user: input.workerProfile.user,
        company: input.workerProfile.company,
      }
    : await getDashboardProfile(supabase);

  if (!profile) {
    return { ok: false, error: "no_profile", code: input.workerProfile ? "tenant_mismatch" : "unauthorized" };
  }

  const userRole = (profile.user.role ?? "staff") as UserRole;
  const answerLocale = resolveAnswerLocale(input.locale, query || "attachment");

  const dict = await getCustomerAppDictionaryForSplits(answerLocale, [
    "navigation",
    "portalStructure",
    "companionPlatformKnowledge",
    "companion",
  ]);
  const t = createTranslator(dict);
  const labels = buildSupportAssistantLabels(t);
  const companionLabels = buildCompanionExperienceLabels(t);
  const legacyCorpus = buildSupportAssistantCorpus(labels, t);

  const workerRuntime = input.workerProfile
    ? await bootstrapCompanionWorkerTenantRuntime(supabase, input.workerProfile, answerLocale)
    : null;

  if (input.workerProfile && !workerRuntime) {
    return { ok: false, error: "worker_bootstrap_failed", code: "tenant_mismatch" };
  }

  const runtimeSupabase = workerRuntime?.scopedSupabase ?? supabase;
  const tenantContext = workerRuntime
    ? workerRuntime.tenantContext
    : await loadCompanionTenantContext(supabase, { locale: answerLocale });
  const resolvedIntegrationContext = resolveCompanionIntegrationContext(
    input.integrationContext ?? null,
    tenantContext,
  );
  const searchContext = buildPlatformSearchContextFromTenant(tenantContext, userRole);

  const snapshotContext = input.platformActiveModules?.length
    ? { activeModules: input.platformActiveModules }
    : undefined;

  let artifactContextBundle:
    | Awaited<ReturnType<typeof loadCompanionArtifactContext>>
    | null = null;

  if (input.conversationId && query) {
    const externalProviderKey = input.externalProvider?.trim().toLowerCase() ?? null;
    let externalConnectionConnected = false;
    if (externalProviderKey === "canva") {
      const connection = await loadCanvaHandoffConnectionMaterial(runtimeSupabase);
      externalConnectionConnected = connection.connected;
    }

    const externalPermissionGranted = externalProviderKey
      ? assertCanvaHandoffPermissionForRole(userRole)
      : false;
    const externalHandoff = externalProviderKey
      ? classifyExternalProviderHandoffFromRegistry({
          provider_key: externalProviderKey,
          consent_granted: input.externalConsent === true,
          permission_granted: externalPermissionGranted,
          connection_connected: externalConnectionConnected,
        })
      : undefined;

    artifactContextBundle = await loadCompanionArtifactContext(runtimeSupabase, {
      conversation_id: input.conversationId,
      query,
      active_artifact_id: input.activeArtifactId,
      attachment_ids: input.attachmentIds,
      external_provider: input.externalProvider,
      external_consent: input.externalConsent,
      external_connection_connected: externalConnectionConnected,
      external_permission_granted: externalPermissionGranted,
      external_handoff: externalHandoff
        ? {
            provider_key: externalHandoff.provider_key,
            status: externalHandoff.status,
            requires_explicit_consent: externalHandoff.requires_explicit_consent,
            message_key: externalHandoff.message_key.replace(/^externalApplications\./, "attachments."),
          }
        : undefined,
    });
  }

  let subscriptionRaw: unknown = null;
  try {
    const { data } = await runtimeSupabase.rpc("get_customer_license_center");
    subscriptionRaw = data;
  } catch {
    subscriptionRaw = null;
  }

  const searchOptions = {
    t,
    locale: answerLocale,
    ctx: searchContext,
    getSearchTermsArray: (key: string) =>
      getSearchTermsArray(dict.customerApp as Record<string, unknown>, key),
    subscriptionRaw,
    supabase: runtimeSupabase,
    integrationContext: resolvedIntegrationContext,
    snapshotContext,
    artifactContext: artifactContextBundle
      ? {
          conversation_id: artifactContextBundle.conversation_id,
          active_artifact: artifactContextBundle.active_artifact,
          attachment_ids: artifactContextBundle.attachment_ids,
          references: artifactContextBundle.references,
        }
      : undefined,
    tenantContext,
    companionSurface: true,
    conversationId: input.conversationId,
  };

  const searchQuery = query || companionLabels.attachments.activeBadge;
  const result = await searchPlatformKnowledge(searchQuery, searchOptions);

  if (result.answer.confidence === "low") {
    void trackLowConfidenceQuery(runtimeSupabase, searchQuery, answerLocale, result.answer.confidence);
  }

  let answer = result.answer;

  if (artifactContextBundle) {
    const att = companionLabels.attachments;
    const externalApps = companionLabels.externalApplications;

    answer = enrichAnswerWithArtifactContext(
      answer,
      artifactContextBundle,
      artifactContextBundle.attachments,
      {
        resolvedActive: (filename) => att.context.resolvedActive.replace("{filename}", filename),
        unresolvedReference: att.context.unresolvedReference,
        noBinaryNote: att.context.noBinaryNote,
      },
    );

    if (artifactContextBundle.externalHandoff) {
      const handoff = artifactContextBundle.externalHandoff;
      answer.externalHandoff = handoff;
      const handoffCopy =
        handoff.status === "consent_required"
          ? att.externalHandoff.consentRequired
          : handoff.status === "permission_denied"
            ? att.externalHandoff.permissionDenied
            : handoff.status === "partial"
              ? att.externalHandoff.partial
              : handoff.status === "unsupported"
                ? externalApps.handoff.unsupported
                : handoff.status === "adapter_available"
                  ? att.externalHandoff.ready
                  : att.externalHandoff.adapterMissing;
      answer = {
        ...answer,
        explanation: [answer.explanation, handoffCopy].filter(Boolean).join("\n\n"),
      };
    }
  }

  const legacyArticle = answerToLegacyArticle(answer);
  const searchJson = {
    found: true,
    query: searchQuery,
    answer,
    articles: [legacyArticle],
    matched_article_id: result.matchedArticleId,
    principle: labels.principle,
    source: answer.source,
    confidence: answer.confidence,
    answer_locale: answerLocale,
  };

  return {
    ok: true,
    searchJson,
    labels: companionLabels,
    question: searchQuery,
  };
}

export async function executeCompanionTurnToPayload(
  supabase: SupabaseClient,
  input: ExecuteCompanionTurnInput,
) {
  const turn = await executeCompanionTurn(supabase, input);
  if (!turn.ok) return turn;

  const { message, payload } = buildReplyFromSearchJson(
    turn.searchJson,
    turn.labels,
    turn.question,
  );

  return {
    ok: true as const,
    assistantContent: message.directAnswer ?? message.content,
    assistantPayload: payload,
    message,
  };
}

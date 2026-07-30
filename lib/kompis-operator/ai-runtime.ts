import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isCircuitEligibleError,
  isCircuitOpenFromState,
  recordKompisCircuitEvent,
} from "./circuit";
import {
  getKompisModelProfile,
  resolveKompisHealthProfile,
  resolveKompisPlannerProfile,
} from "./model-profiles";
import { buildKompisSystemPromptV3, KOMPIS_AI_SYSTEM_PROMPT_VERSION } from "./prompt";
import {
  getKompisAiSecretPresence,
  hasKompisAiProviderSecretConfigured,
  isKompisAiBaseUrlAllowlisted,
  type KompisAiReadiness,
  type KompisAiReadinessStatus,
} from "./readiness";
import { listAvailableKompisOperatorTools } from "./tools-registry";
import { recordKompisAiUsage } from "./usage";

export { KOMPIS_AI_SYSTEM_PROMPT_VERSION } from "./prompt";
export {
  KOMPIS_AI_AUTHORITATIVE_ENV,
  KOMPIS_AI_ALLOWED_BASE_URLS,
  getKompisAiSecretPresence,
  hasKompisAiProviderSecretConfigured,
  isKompisAiBaseUrlAllowlisted,
  type KompisAiReadiness,
  type KompisAiReadinessStatus,
} from "./readiness";
export { providerReadinessTone as providerStatusTone } from "./severity";

export const KOMPIS_AI_MAX_INPUT = 4000;
export const KOMPIS_AI_MAX_OUTPUT = 4000;
export const KOMPIS_AI_TIMEOUT_MS = 12_000;
export const KOMPIS_AI_MAX_RETRIES = 1;
export const KOMPIS_AI_HEALTH_TIMEOUT_MS = 6_000;

/** @deprecated Prefer KompisAiReadinessStatus — kept for V2 workspace compatibility. */
export type KompisAiProviderStatus =
  | "not_configured"
  | "active"
  | "unavailable"
  | "fallback"
  | "degraded"
  | "cooldown"
  | "ready"
  | "disabled";

export type KompisAiRuntimeStatus = {
  providerConfigured: boolean;
  providerStatus: KompisAiProviderStatus;
  liveAiActive: boolean;
  deterministicFallbackActive: boolean;
  systemPromptVersion: string;
  plannerVersion: string;
  profileId: string | null;
  readiness: KompisAiReadinessStatus;
  circuitOpen: boolean;
  authoritativeEnvName: string;
  code?: string;
};

function readProviderApiKey(): string | null {
  const key =
    process.env.AIPIFY_KOMPIS_AI_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    "";
  return key.length > 0 ? key : null;
}

function readProviderBaseUrl(): string {
  return (
    process.env.AIPIFY_KOMPIS_AI_BASE_URL?.trim() ||
    "https://api.openai.com/v1"
  );
}

function mapProviderHttpError(status: number): string {
  if (status === 429) return "provider_rate_limited";
  if (status >= 500) return "provider_http_5xx";
  return "provider_http_error";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function redactForModel(input: string): string {
  return input
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, "[redacted]")
    .replace(/sk-[A-Za-z0-9]{10,}/g, "[redacted]")
    .replace(/service_role/gi, "[redacted]")
    .replace(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, "[redacted]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .slice(0, KOMPIS_AI_MAX_INPUT);
}

export function getKompisAiRuntimeStatus(
  providerState?: Record<string, unknown>,
): KompisAiRuntimeStatus {
  const profile = resolveKompisPlannerProfile();
  const configured = hasKompisAiProviderSecretConfigured();
  const baseUrlOk = isKompisAiBaseUrlAllowlisted(readProviderBaseUrl());
  const circuitOpen = providerState ? isCircuitOpenFromState(providerState) : false;
  const dbStatus =
    typeof providerState?.status === "string"
      ? (providerState.status as KompisAiReadinessStatus)
      : null;

  let readiness: KompisAiReadinessStatus = "not_configured";
  if (!configured) readiness = "not_configured";
  else if (!baseUrlOk) readiness = "unavailable";
  else if (circuitOpen) readiness = "cooldown";
  else if (dbStatus === "disabled") readiness = "disabled";
  else if (dbStatus === "degraded") readiness = "degraded";
  else if (dbStatus === "unavailable") readiness = "unavailable";
  else readiness = "ready";

  const liveAiActive = configured && baseUrlOk && !circuitOpen && readiness === "ready";

  return {
    providerConfigured: configured,
    providerStatus:
      readiness === "ready"
        ? "active"
        : readiness === "not_configured"
          ? "not_configured"
          : readiness === "cooldown" || readiness === "degraded"
            ? readiness
            : "unavailable",
    liveAiActive,
    deterministicFallbackActive: true,
    systemPromptVersion: KOMPIS_AI_SYSTEM_PROMPT_VERSION,
    plannerVersion: "planner_v2",
    profileId: profile.id,
    readiness,
    circuitOpen,
    authoritativeEnvName: getKompisAiSecretPresence().authoritativeEnvName,
    code: !configured
      ? "AI_PROVIDER_NOT_CONFIGURED"
      : !baseUrlOk
        ? "AI_PROVIDER_BASE_URL_INVALID"
        : circuitOpen
          ? "AI_PROVIDER_COOLDOWN"
          : undefined,
  };
}

export function buildKompisAiReadiness(
  providerState?: Record<string, unknown>,
): KompisAiReadiness {
  const runtime = getKompisAiRuntimeStatus(providerState);
  const profile = resolveKompisPlannerProfile();
  return {
    status: runtime.readiness,
    providerConfigured: runtime.providerConfigured,
    liveAiActive: runtime.liveAiActive,
    deterministicFallbackActive: true,
    providerFamily: "openai_compatible",
    modelProfile: profile.id,
    systemPromptVersion: KOMPIS_AI_SYSTEM_PROMPT_VERSION,
    plannerVersion: "planner_v2",
    circuitOpen: runtime.circuitOpen,
    cooldownUntil:
      typeof providerState?.cooldown_until === "string" ? providerState.cooldown_until : null,
    lastHealthAt:
      typeof providerState?.last_health_at === "string" ? providerState.last_health_at : null,
    lastSuccessAt:
      typeof providerState?.last_success_at === "string" ? providerState.last_success_at : null,
    lastLatencyMs:
      typeof providerState?.last_latency_ms === "number" ? providerState.last_latency_ms : null,
    lastSafeErrorCode:
      typeof providerState?.last_safe_error_code === "string"
        ? providerState.last_safe_error_code
        : null,
    fallbackAvailable: true,
    baseUrlAllowlisted: isKompisAiBaseUrlAllowlisted(readProviderBaseUrl()),
    authoritativeEnvName: "AIPIFY_KOMPIS_AI_API_KEY",
    code: runtime.code,
  };
}

export type KompisAiPlanCandidate = {
  intent?: unknown;
  title?: unknown;
  userSummary?: unknown;
  riskClass?: unknown;
  requiresApproval?: unknown;
  confidence?: unknown;
  steps?: unknown;
  blockedReasonCode?: unknown;
};

export async function requestKompisAiPlan(
  rawRequest: string,
  options?: { supabase?: SupabaseClient; organizationId?: string | null; runId?: string | null },
): Promise<{
  ok: boolean;
  status: KompisAiProviderStatus;
  candidate?: KompisAiPlanCandidate;
  errorCode?: string;
  modelProfile?: string;
  latencyMs?: number;
}> {
  const profile = resolveKompisPlannerProfile();
  const apiKey = readProviderApiKey();
  const baseUrl = readProviderBaseUrl();
  if (!apiKey) {
    return {
      ok: false,
      status: "not_configured",
      errorCode: "AI_PROVIDER_NOT_CONFIGURED",
      modelProfile: profile.id,
    };
  }
  if (!isKompisAiBaseUrlAllowlisted(baseUrl)) {
    return {
      ok: false,
      status: "unavailable",
      errorCode: "AI_PROVIDER_BASE_URL_INVALID",
      modelProfile: profile.id,
    };
  }

  if (options?.supabase) {
    const { data } = await options.supabase.rpc("get_app_kompis_ai_provider_state");
    const state = asRecord(data);
    if (isCircuitOpenFromState(state)) {
      return {
        ok: false,
        status: "cooldown",
        errorCode: "AI_PROVIDER_COOLDOWN",
        modelProfile: profile.id,
      };
    }
  }

  const redacted = redactForModel(rawRequest);
  const toolKeys = listAvailableKompisOperatorTools().map((tool) => tool.key);
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), profile.timeoutMs);

  try {
    let lastError = "provider_unavailable";
    for (let attempt = 0; attempt <= profile.retry; attempt += 1) {
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: profile.modelAlias,
            temperature: profile.temperature,
            max_tokens: Math.min(800, profile.maxOutput),
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: buildKompisSystemPromptV3({ allowlistedToolKeys: toolKeys }),
              },
              { role: "user", content: redacted },
            ],
          }),
        });

        if (!response.ok) {
          lastError = mapProviderHttpError(response.status);
          continue;
        }

        const payload = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
        };
        const content = payload.choices?.[0]?.message?.content ?? "";
        if (!content || content.length > profile.maxOutput) {
          lastError = "provider_output_invalid";
          continue;
        }
        const parsed = JSON.parse(content) as KompisAiPlanCandidate;
        const latencyMs = Date.now() - started;
        if (options?.supabase) {
          await recordKompisCircuitEvent(options.supabase, "success");
          await recordKompisAiUsage(options.supabase, {
            organizationId: options.organizationId,
            runId: options.runId,
            modelProfile: profile.id,
            plannerSource: "ai",
            inputUnits: payload.usage?.prompt_tokens ?? null,
            outputUnits: payload.usage?.completion_tokens ?? null,
            totalUnits: payload.usage?.total_tokens ?? null,
            latencyMs,
            result: "success",
          });
        }
        return {
          ok: true,
          status: "active",
          candidate: parsed,
          modelProfile: profile.id,
          latencyMs,
        };
      } catch (error) {
        const aborted =
          error instanceof Error && (error.name === "AbortError" || /aborted/i.test(error.message));
        lastError = aborted ? "provider_timeout" : "provider_network_failure";
      }
    }

    if (options?.supabase && isCircuitEligibleError(lastError)) {
      await recordKompisCircuitEvent(options.supabase, "failure", lastError);
      await recordKompisAiUsage(options.supabase, {
        organizationId: options.organizationId,
        runId: options.runId,
        modelProfile: profile.id,
        plannerSource: "ai_fallback",
        latencyMs: Date.now() - started,
        result: "fallback",
        safeErrorCode: lastError,
      });
    }
    return {
      ok: false,
      status: "unavailable",
      errorCode: lastError,
      modelProfile: profile.id,
      latencyMs: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}

export type KompisAiHealthResult = {
  ok: boolean;
  status: KompisAiReadinessStatus;
  latencyMs: number;
  checkedAt: string;
  modelProfile: string;
  providerFamily: "openai_compatible";
  safeErrorCode?: string;
  fallbackAvailable: true;
};

export async function runKompisAiProviderHealthCheck(
  supabase: SupabaseClient,
): Promise<KompisAiHealthResult> {
  const profile = resolveKompisHealthProfile();
  const checkedAt = new Date().toISOString();
  const apiKey = readProviderApiKey();
  const baseUrl = readProviderBaseUrl();

  if (!apiKey) {
    return {
      ok: false,
      status: "not_configured",
      latencyMs: 0,
      checkedAt,
      modelProfile: profile.id,
      providerFamily: "openai_compatible",
      safeErrorCode: "AI_PROVIDER_NOT_CONFIGURED",
      fallbackAvailable: true,
    };
  }
  if (!isKompisAiBaseUrlAllowlisted(baseUrl)) {
    await supabase.rpc("record_kompis_ai_provider_health", {
      p_ok: false,
      p_latency_ms: 0,
      p_safe_error_code: "AI_PROVIDER_BASE_URL_INVALID",
      p_model_profile: profile.id,
      p_status: "unavailable",
    });
    return {
      ok: false,
      status: "unavailable",
      latencyMs: 0,
      checkedAt,
      modelProfile: profile.id,
      providerFamily: "openai_compatible",
      safeErrorCode: "AI_PROVIDER_BASE_URL_INVALID",
      fallbackAvailable: true,
    };
  }

  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), KOMPIS_AI_HEALTH_TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: profile.modelAlias,
        temperature: 0,
        max_tokens: 16,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return JSON only: {\"ok\":true}. No other text.",
          },
          { role: "user", content: "health" },
        ],
      }),
    });
    const latencyMs = Date.now() - started;
    if (!response.ok) {
      const code = mapProviderHttpError(response.status);
      await supabase.rpc("record_kompis_ai_provider_health", {
        p_ok: false,
        p_latency_ms: latencyMs,
        p_safe_error_code: code,
        p_model_profile: profile.id,
        p_status: code === "provider_rate_limited" ? "degraded" : "unavailable",
      });
      await recordKompisAiUsage(supabase, {
        modelProfile: profile.id,
        plannerSource: "health",
        latencyMs,
        result: "error",
        safeErrorCode: code,
      });
      return {
        ok: false,
        status: code === "provider_rate_limited" ? "degraded" : "unavailable",
        latencyMs,
        checkedAt,
        modelProfile: profile.id,
        providerFamily: "openai_compatible",
        safeErrorCode: code,
        fallbackAvailable: true,
      };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { total_tokens?: number };
    };
    const content = payload.choices?.[0]?.message?.content ?? "";
    let valid = false;
    try {
      const parsed = JSON.parse(content) as { ok?: unknown };
      valid = parsed.ok === true;
    } catch {
      valid = false;
    }

    if (!valid) {
      await supabase.rpc("record_kompis_ai_provider_health", {
        p_ok: false,
        p_latency_ms: latencyMs,
        p_safe_error_code: "provider_output_invalid",
        p_model_profile: profile.id,
        p_status: "degraded",
      });
      await recordKompisAiUsage(supabase, {
        modelProfile: profile.id,
        plannerSource: "health",
        latencyMs,
        totalUnits: payload.usage?.total_tokens ?? null,
        result: "error",
        safeErrorCode: "provider_output_invalid",
      });
      return {
        ok: false,
        status: "degraded",
        latencyMs,
        checkedAt,
        modelProfile: profile.id,
        providerFamily: "openai_compatible",
        safeErrorCode: "provider_output_invalid",
        fallbackAvailable: true,
      };
    }

    await supabase.rpc("record_kompis_ai_provider_health", {
      p_ok: true,
      p_latency_ms: latencyMs,
      p_safe_error_code: null,
      p_model_profile: profile.id,
      p_status: "ready",
    });
    await recordKompisCircuitEvent(supabase, "success");
    await recordKompisAiUsage(supabase, {
      modelProfile: profile.id,
      plannerSource: "health",
      latencyMs,
      totalUnits: payload.usage?.total_tokens ?? null,
      result: "success",
    });
    return {
      ok: true,
      status: "ready",
      latencyMs,
      checkedAt,
      modelProfile: profile.id,
      providerFamily: "openai_compatible",
      fallbackAvailable: true,
    };
  } catch (error) {
    const latencyMs = Date.now() - started;
    const aborted =
      error instanceof Error && (error.name === "AbortError" || /aborted/i.test(error.message));
    const code = aborted ? "provider_timeout" : "provider_network_failure";
    await supabase.rpc("record_kompis_ai_provider_health", {
      p_ok: false,
      p_latency_ms: latencyMs,
      p_safe_error_code: code,
      p_model_profile: profile.id,
      p_status: "unavailable",
    });
    await recordKompisAiUsage(supabase, {
      modelProfile: profile.id,
      plannerSource: "health",
      latencyMs,
      result: "error",
      safeErrorCode: code,
    });
    return {
      ok: false,
      status: "unavailable",
      latencyMs,
      checkedAt,
      modelProfile: profile.id,
      providerFamily: "openai_compatible",
      safeErrorCode: code,
      fallbackAvailable: true,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function assertNoClientModelOverride(body: unknown): boolean {
  if (!body || typeof body !== "object") return true;
  const record = body as Record<string, unknown>;
  return !(
    "model" in record ||
    "provider" in record ||
    "baseUrl" in record ||
    "apiKey" in record ||
    "systemPrompt" in record ||
    "temperature" in record ||
    "maxTokens" in record
  );
}

export function getKompisModelProfileSafe(id: string) {
  return getKompisModelProfile(id);
}

import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { redactForModel } from "./ai-runtime";
import {
  isCircuitEligibleError,
  isCircuitOpenFromState,
  recordKompisCircuitEvent,
} from "./circuit";
import { getKompisModelProfile, resolveKompisHealthProfile } from "./model-profiles";
import {
  classifyKompisProviderHttpError,
  providerHostFromBaseUrl,
  type KompisProviderHttpClassification,
} from "./provider-http-error";
import {
  hasKompisAiProviderSecretConfigured,
  isKompisAiBaseUrlAllowlisted,
} from "./readiness";
import { recordKompisAiUsage } from "./usage";

export const WEBSITE_KOMPIS_GROUNDED_COMPLETION_PROFILE_ID = "kompis_result_summary_v1" as const;

export type KompisGroundedCostControlsMode = "required" | "optional" | "off";

export type KompisGroundedProviderDiagnostics = {
  httpStatus: number | null;
  category: KompisProviderHttpClassification["category"] | null;
  providerErrorType: string | null;
  providerErrorCode: string | null;
  requestId: string | null;
  retryAfterSeconds: number | null;
  providerHost: string;
  modelAlias: string;
  attempts: number;
  costControls: KompisGroundedCostControlsMode;
};

export type KompisGroundedCompletionResult =
  | {
      ok: true;
      text: string;
      modelProfile: string;
      latencyMs: number;
      usage: {
        inputUnits: number | null;
        outputUnits: number | null;
        totalUnits: number | null;
      };
      providerDiagnostics?: KompisGroundedProviderDiagnostics;
    }
  | {
      ok: false;
      errorCode: string;
      modelProfile: string;
      latencyMs?: number;
      providerDiagnostics?: KompisGroundedProviderDiagnostics;
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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function emptyDiagnostics(
  baseUrl: string,
  modelAlias: string,
  costControls: KompisGroundedCostControlsMode,
  attempts = 0,
): KompisGroundedProviderDiagnostics {
  return {
    httpStatus: null,
    category: null,
    providerErrorType: null,
    providerErrorCode: null,
    requestId: null,
    retryAfterSeconds: null,
    providerHost: providerHostFromBaseUrl(baseUrl),
    modelAlias,
    attempts,
    costControls,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function usageResultForError(
  errorCode: string,
): "rate_limited" | "fallback" | "error" {
  if (errorCode === "provider_rate_limited" || errorCode === "provider_quota_exhausted") {
    return "rate_limited";
  }
  if (errorCode === "AI_PROVIDER_CONTROLS_UNAVAILABLE" || errorCode === "AI_PROVIDER_COOLDOWN") {
    return "error";
  }
  return "fallback";
}

/**
 * Grounded completion via the existing Core OpenAI-compatible gateway.
 * Reuses allowlisted base URL, server secrets, circuit breaker, timeout/retry, and usage metering.
 */
export async function requestKompisGroundedTextCompletion(input: {
  system: string;
  user: string;
  supabase?: SupabaseClient;
  organizationId?: string | null;
  runId?: string | null;
  /** Production customer ask must use required; Preview QA may use off (no Core metering writes). */
  costControls?: KompisGroundedCostControlsMode;
}): Promise<KompisGroundedCompletionResult> {
  const profile =
    getKompisModelProfile(WEBSITE_KOMPIS_GROUNDED_COMPLETION_PROFILE_ID) ??
    resolveKompisHealthProfile();
  const apiKey = readProviderApiKey();
  const baseUrl = readProviderBaseUrl();
  const costControls = input.costControls ?? "optional";
  let diagnostics = emptyDiagnostics(baseUrl, profile.modelAlias, costControls);

  if (!apiKey || !hasKompisAiProviderSecretConfigured()) {
    console.warn("[website-kompis-grounded]", {
      event: "completion_unavailable",
      errorCode: "AI_PROVIDER_NOT_CONFIGURED",
      modelProfile: profile.id,
      providerHost: diagnostics.providerHost,
    });
    return {
      ok: false,
      errorCode: "AI_PROVIDER_NOT_CONFIGURED",
      modelProfile: profile.id,
      providerDiagnostics: diagnostics,
    };
  }
  if (!isKompisAiBaseUrlAllowlisted(baseUrl)) {
    console.warn("[website-kompis-grounded]", {
      event: "completion_unavailable",
      errorCode: "AI_PROVIDER_BASE_URL_INVALID",
      modelProfile: profile.id,
      providerHost: diagnostics.providerHost,
    });
    return {
      ok: false,
      errorCode: "AI_PROVIDER_BASE_URL_INVALID",
      modelProfile: profile.id,
      providerDiagnostics: diagnostics,
    };
  }

  if (costControls === "required" && !input.supabase) {
    console.warn("[website-kompis-grounded]", {
      event: "completion_unavailable",
      errorCode: "AI_PROVIDER_CONTROLS_UNAVAILABLE",
      modelProfile: profile.id,
      costControls,
      reason: "metering_context_missing",
    });
    return {
      ok: false,
      errorCode: "AI_PROVIDER_CONTROLS_UNAVAILABLE",
      modelProfile: profile.id,
      providerDiagnostics: diagnostics,
    };
  }

  if (input.supabase && costControls !== "off") {
    const { data, error } = await input.supabase.rpc("get_app_kompis_ai_provider_state");
    if (error) {
      if (costControls === "required") {
        console.warn("[website-kompis-grounded]", {
          event: "completion_unavailable",
          errorCode: "AI_PROVIDER_CONTROLS_UNAVAILABLE",
          modelProfile: profile.id,
          costControls,
          reason: "circuit_state_unavailable",
        });
        return {
          ok: false,
          errorCode: "AI_PROVIDER_CONTROLS_UNAVAILABLE",
          modelProfile: profile.id,
          providerDiagnostics: diagnostics,
        };
      }
    } else if (isCircuitOpenFromState(asRecord(data))) {
      return {
        ok: false,
        errorCode: "AI_PROVIDER_COOLDOWN",
        modelProfile: profile.id,
        providerDiagnostics: diagnostics,
      };
    }
  }

  const system = redactForModel(input.system);
  const user = redactForModel(input.user);
  const started = Date.now();
  const deadline = started + Math.min(profile.timeoutMs, 120_000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), profile.timeoutMs);
  const maxTokens = Math.min(600, profile.maxOutput);
  // Honor profile.retry only. Do not force an extra attempt that can amplify 429/quota storms.
  const maxAttempts = Math.max(1, profile.retry + 1);

  try {
    let lastError = "provider_unavailable";
    let lastClassification: KompisProviderHttpClassification | null = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      diagnostics = { ...diagnostics, attempts: attempt + 1 };
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
            max_tokens: maxTokens,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
        });

        if (!response.ok) {
          let body: unknown = null;
          try {
            body = await response.json();
          } catch {
            body = null;
          }
          const classification = classifyKompisProviderHttpError({
            status: response.status,
            body,
            requestIdHeader: response.headers.get("x-request-id"),
            retryAfterHeader: response.headers.get("retry-after"),
          });
          lastClassification = classification;
          lastError = classification.errorCode;
          diagnostics = {
            ...diagnostics,
            httpStatus: classification.httpStatus,
            category: classification.category,
            providerErrorType: classification.providerErrorType,
            providerErrorCode: classification.providerErrorCode,
            requestId: classification.requestId,
            retryAfterSeconds: classification.retryAfterSeconds,
            attempts: attempt + 1,
          };

          console.warn("[website-kompis-grounded]", {
            event: "provider_http_error",
            errorCode: classification.errorCode,
            httpStatus: classification.httpStatus,
            category: classification.category,
            providerErrorType: classification.providerErrorType,
            providerErrorCode: classification.providerErrorCode,
            requestId: classification.requestId,
            retryAfterSeconds: classification.retryAfterSeconds,
            retryable: classification.retryable,
            providerHost: diagnostics.providerHost,
            modelAlias: profile.modelAlias,
            modelProfile: profile.id,
            attempt: attempt + 1,
          });

          if (!classification.retryable || attempt + 1 >= maxAttempts) {
            break;
          }

          const remainingMs = deadline - Date.now();
          const waitMs =
            classification.retryAfterSeconds != null
              ? classification.retryAfterSeconds * 1000
              : 250 * (attempt + 1);
          if (waitMs > remainingMs || remainingMs <= 0) {
            break;
          }
          await sleep(waitMs);
          continue;
        }

        const payload = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
        };
        const content = payload.choices?.[0]?.message?.content?.trim() ?? "";
        // maxOutput is a token budget for the provider request; allow ~4 chars/token
        // plus JSON overhead so valid grounded payloads are not rejected as invalid.
        const maxContentChars = Math.max(2_400, profile.maxOutput * 4);
        if (!content || content.length > maxContentChars) {
          lastError = "provider_output_invalid";
          continue;
        }

        const latencyMs = Date.now() - started;
        if (input.supabase && costControls !== "off") {
          await recordKompisCircuitEvent(input.supabase, "success");
          await recordKompisAiUsage(input.supabase, {
            organizationId: input.organizationId,
            runId: input.runId,
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
          text: content,
          modelProfile: profile.id,
          latencyMs,
          usage: {
            inputUnits: payload.usage?.prompt_tokens ?? null,
            outputUnits: payload.usage?.completion_tokens ?? null,
            totalUnits: payload.usage?.total_tokens ?? null,
          },
          providerDiagnostics: {
            ...diagnostics,
            httpStatus: 200,
            attempts: attempt + 1,
          },
        };
      } catch (error) {
        const aborted =
          error instanceof Error &&
          (error.name === "AbortError" || /aborted/i.test(error.message));
        lastError = aborted ? "provider_timeout" : "provider_network_failure";
      }
    }

    if (input.supabase && costControls !== "off" && isCircuitEligibleError(lastError)) {
      await recordKompisCircuitEvent(input.supabase, "failure", lastError);
      await recordKompisAiUsage(input.supabase, {
        organizationId: input.organizationId,
        runId: input.runId,
        modelProfile: profile.id,
        plannerSource: "ai_fallback",
        latencyMs: Date.now() - started,
        result: usageResultForError(lastError),
        safeErrorCode: lastError,
      });
    }

    console.warn("[website-kompis-grounded]", {
      event: "completion_failed",
      errorCode: lastError,
      modelProfile: profile.id,
      latencyMs: Date.now() - started,
      category: lastClassification?.category ?? null,
      providerErrorType: lastClassification?.providerErrorType ?? null,
      providerErrorCode: lastClassification?.providerErrorCode ?? null,
      requestId: lastClassification?.requestId ?? null,
      retryAfterSeconds: lastClassification?.retryAfterSeconds ?? null,
      providerHost: diagnostics.providerHost,
      attempts: diagnostics.attempts,
      costControls,
    });
    return {
      ok: false,
      errorCode: lastError,
      modelProfile: profile.id,
      latencyMs: Date.now() - started,
      providerDiagnostics: diagnostics,
    };
  } finally {
    clearTimeout(timer);
  }
}

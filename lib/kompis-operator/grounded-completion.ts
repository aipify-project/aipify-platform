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
  hasKompisAiProviderSecretConfigured,
  isKompisAiBaseUrlAllowlisted,
} from "./readiness";
import { recordKompisAiUsage } from "./usage";

export const WEBSITE_KOMPIS_GROUNDED_COMPLETION_PROFILE_ID = "kompis_result_summary_v1" as const;

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
    }
  | {
      ok: false;
      errorCode: string;
      modelProfile: string;
      latencyMs?: number;
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
}): Promise<KompisGroundedCompletionResult> {
  const profile =
    getKompisModelProfile(WEBSITE_KOMPIS_GROUNDED_COMPLETION_PROFILE_ID) ??
    resolveKompisHealthProfile();
  const apiKey = readProviderApiKey();
  const baseUrl = readProviderBaseUrl();

  if (!apiKey || !hasKompisAiProviderSecretConfigured()) {
    console.info("[website-kompis-grounded]", {
      event: "completion_unavailable",
      errorCode: "AI_PROVIDER_NOT_CONFIGURED",
      modelProfile: profile.id,
    });
    return {
      ok: false,
      errorCode: "AI_PROVIDER_NOT_CONFIGURED",
      modelProfile: profile.id,
    };
  }
  if (!isKompisAiBaseUrlAllowlisted(baseUrl)) {
    console.info("[website-kompis-grounded]", {
      event: "completion_unavailable",
      errorCode: "AI_PROVIDER_BASE_URL_INVALID",
      modelProfile: profile.id,
    });
    return {
      ok: false,
      errorCode: "AI_PROVIDER_BASE_URL_INVALID",
      modelProfile: profile.id,
    };
  }

  if (input.supabase) {
    const { data } = await input.supabase.rpc("get_app_kompis_ai_provider_state");
    if (isCircuitOpenFromState(asRecord(data))) {
      return {
        ok: false,
        errorCode: "AI_PROVIDER_COOLDOWN",
        modelProfile: profile.id,
      };
    }
  }

  const system = redactForModel(input.system);
  const user = redactForModel(input.user);
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), profile.timeoutMs);
  const maxTokens = Math.min(600, profile.maxOutput);
  // Allow one retry for transient provider/http failures even when the summary
  // profile lists retry=0 — grounded ask should prefer model over extractive.
  const maxAttempts = Math.max(1, profile.retry) + 1;

  try {
    let lastError = "provider_unavailable";
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
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
          lastError = mapProviderHttpError(response.status);
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
        if (input.supabase) {
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
        };
      } catch (error) {
        const aborted =
          error instanceof Error &&
          (error.name === "AbortError" || /aborted/i.test(error.message));
        lastError = aborted ? "provider_timeout" : "provider_network_failure";
      }
    }

    if (input.supabase && isCircuitEligibleError(lastError)) {
      await recordKompisCircuitEvent(input.supabase, "failure", lastError);
      await recordKompisAiUsage(input.supabase, {
        organizationId: input.organizationId,
        runId: input.runId,
        modelProfile: profile.id,
        plannerSource: "ai_fallback",
        latencyMs: Date.now() - started,
        result: lastError === "provider_rate_limited" ? "rate_limited" : "fallback",
        safeErrorCode: lastError,
      });
    }

    console.info("[website-kompis-grounded]", {
      event: "completion_failed",
      errorCode: lastError,
      modelProfile: profile.id,
      latencyMs: Date.now() - started,
    });
    return {
      ok: false,
      errorCode: lastError,
      modelProfile: profile.id,
      latencyMs: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}

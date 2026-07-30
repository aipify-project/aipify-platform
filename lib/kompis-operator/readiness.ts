import "server-only";

export type KompisAiReadinessStatus =
  | "not_configured"
  | "ready"
  | "degraded"
  | "cooldown"
  | "unavailable"
  | "disabled";

export type KompisAiReadiness = {
  status: KompisAiReadinessStatus;
  providerConfigured: boolean;
  liveAiActive: boolean;
  deterministicFallbackActive: boolean;
  providerFamily: "openai_compatible";
  modelProfile: string;
  systemPromptVersion: string;
  plannerVersion: string;
  circuitOpen: boolean;
  cooldownUntil: string | null;
  lastHealthAt: string | null;
  lastSuccessAt: string | null;
  lastLatencyMs: number | null;
  lastSafeErrorCode: string | null;
  fallbackAvailable: boolean;
  baseUrlAllowlisted: boolean;
  authoritativeEnvName: "AIPIFY_KOMPIS_AI_API_KEY";
  code?: string;
};

export const KOMPIS_AI_AUTHORITATIVE_ENV = "AIPIFY_KOMPIS_AI_API_KEY" as const;
export const KOMPIS_AI_FALLBACK_ENV = "OPENAI_API_KEY" as const;

export const KOMPIS_AI_ALLOWED_BASE_URLS = [
  "https://api.openai.com/v1",
] as const;

export function isKompisAiBaseUrlAllowlisted(baseUrl: string): boolean {
  try {
    const parsed = new URL(baseUrl);
    return KOMPIS_AI_ALLOWED_BASE_URLS.some((allowed) => {
      const a = new URL(allowed);
      return parsed.origin === a.origin && parsed.pathname.replace(/\/$/, "") === a.pathname.replace(/\/$/, "");
    });
  } catch {
    return false;
  }
}

export function hasKompisAiProviderSecretConfigured(): boolean {
  return Boolean(
    process.env.AIPIFY_KOMPIS_AI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim(),
  );
}

/** Presence only — never returns secret value, prefix, length, or hash. */
export function getKompisAiSecretPresence(): {
  authoritativeEnvName: typeof KOMPIS_AI_AUTHORITATIVE_ENV;
  configured: boolean;
  fallbackEnvConfigured: boolean;
} {
  return {
    authoritativeEnvName: KOMPIS_AI_AUTHORITATIVE_ENV,
    configured: Boolean(process.env.AIPIFY_KOMPIS_AI_API_KEY?.trim()),
    fallbackEnvConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
  };
}

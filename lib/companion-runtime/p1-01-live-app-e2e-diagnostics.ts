import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import { P1_01_LIVE_E2E_ENV } from "./p1-01-live-app-e2e-env";

const SECRET_PATTERNS = [
  /Bearer\s+[A-Za-z0-9._-]+/gi,
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
];

export function redactSecretsFromMessage(message: string): string {
  let sanitized = message;
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[redacted]");
  }
  return sanitized.slice(0, 240);
}

export function assertArtifactContainsNoSecrets(payload: string): boolean {
  for (const pattern of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(payload)) return false;
  }
  return true;
}

export type P1LiveE2eAuthOutcome =
  | "not_attempted"
  | "success"
  | "password_login_not_available"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "network_error"
  | "organization_context_missing"
  | "error";

export type P1LiveE2eAuthDiagnostics = {
  target_host: string | null;
  environment: string;
  supabase_url_configured: boolean;
  supabase_anon_key_configured: boolean;
  live_e2e_enabled: boolean;
  email_configured: boolean;
  password_configured: boolean;
  password_length: number;
  auth_outcome: P1LiveE2eAuthOutcome;
  auth_message_redacted: string | null;
};

function readEnvFlag(name: string): boolean {
  const value = process.env[name]?.trim();
  return Boolean(value);
}

export function resolveSupabaseTargetHost(supabaseUrl: string | null | undefined): string | null {
  if (!supabaseUrl?.trim()) return null;
  try {
    return new URL(supabaseUrl.trim()).host;
  } catch {
    return null;
  }
}

export function buildP1LiveE2eAuthDiagnostics(input?: {
  config?: P1LiveE2eEnvConfig | null;
  auth_outcome?: P1LiveE2eAuthOutcome;
  auth_message?: string | null;
}): P1LiveE2eAuthDiagnostics {
  const config = input?.config ?? null;
  return {
    target_host: resolveSupabaseTargetHost(config?.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL),
    environment: config?.environment ?? process.env.APP_LIVE_E2E_ENVIRONMENT?.trim() ?? "unknown",
    supabase_url_configured: readEnvFlag(P1_01_LIVE_E2E_ENV.supabaseUrl),
    supabase_anon_key_configured: readEnvFlag(P1_01_LIVE_E2E_ENV.supabaseAnonKey),
    live_e2e_enabled: process.env.APP_LIVE_E2E_ENABLED?.trim() === "1",
    email_configured: readEnvFlag(P1_01_LIVE_E2E_ENV.email),
    password_configured: readEnvFlag(P1_01_LIVE_E2E_ENV.password),
    password_length: (config?.password ?? process.env.APP_LIVE_E2E_PASSWORD ?? "").trim().length,
    auth_outcome: input?.auth_outcome ?? "not_attempted",
    auth_message_redacted: input?.auth_message
      ? redactSecretsFromMessage(input.auth_message)
      : null,
  };
}

export function formatP1LiveE2eAuthDiagnostics(diagnostics: P1LiveE2eAuthDiagnostics): string[] {
  return [
    `target_host: ${diagnostics.target_host ?? "missing"}`,
    `environment: ${diagnostics.environment}`,
    `supabase_url_configured: ${diagnostics.supabase_url_configured}`,
    `supabase_anon_key_configured: ${diagnostics.supabase_anon_key_configured}`,
    `live_e2e_enabled: ${diagnostics.live_e2e_enabled}`,
    `email_configured: ${diagnostics.email_configured}`,
    `password_configured: ${diagnostics.password_configured}`,
    `password_length: ${diagnostics.password_length}`,
    `auth_outcome: ${diagnostics.auth_outcome}`,
    diagnostics.auth_message_redacted
      ? `auth_message: ${diagnostics.auth_message_redacted}`
      : "auth_message: n/a",
  ];
}

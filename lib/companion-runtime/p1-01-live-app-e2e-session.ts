import { createHash } from "node:crypto";
import { createClient, type AuthError, type Session, type SupabaseClient } from "@supabase/supabase-js";
import type { P1LiveE2eAuthDiagnostics, P1LiveE2eAuthOutcome } from "./p1-01-live-app-e2e-diagnostics";
import { buildP1LiveE2eAuthDiagnostics, redactSecretsFromMessage } from "./p1-01-live-app-e2e-diagnostics";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import { normalizeP1LiveE2eEmail } from "./p1-01-live-app-e2e-env";

export type P1LiveE2eAuthenticatedSession = {
  supabase: SupabaseClient;
  session: Session;
  organizationId: string | null;
  tenantId: string | null;
  userRole: string;
  organizationReference: string;
};

export type P1LiveE2eAuthFailure = {
  ok: false;
  blocker_code:
    | "password_login_not_available"
    | "invalid_credentials"
    | "email_not_confirmed"
    | "network_error"
    | "organization_context_missing"
    | "auth_failed";
  message: string;
  diagnostics: P1LiveE2eAuthDiagnostics;
};

export type P1LiveE2eAuthSuccess = {
  ok: true;
  session: P1LiveE2eAuthenticatedSession;
  diagnostics: P1LiveE2eAuthDiagnostics;
};

export type P1LiveE2eAuthResult = P1LiveE2eAuthSuccess | P1LiveE2eAuthFailure;

export { assertArtifactContainsNoSecrets, redactSecretsFromMessage } from "./p1-01-live-app-e2e-diagnostics";

export function anonymizeOrganizationReference(
  organizationId: string,
  explicitRef: string | null,
): string {
  if (explicitRef?.trim()) return explicitRef.trim();
  const digest = createHash("sha256").update(organizationId).digest("hex").slice(0, 12);
  return `org_${digest}`;
}

function isNetworkAuthError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("fetch failed") ||
    normalized.includes("network") ||
    normalized.includes("econnrefused") ||
    normalized.includes("enotfound") ||
    normalized.includes("timeout")
  );
}

function classifyPasswordLoginError(error: AuthError): {
  blocker_code: P1LiveE2eAuthFailure["blocker_code"];
  outcome: P1LiveE2eAuthOutcome;
} {
  const message = error.message.toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (
    code === "email_provider_disabled" ||
    code === "provider_disabled" ||
    message.includes("magic link") ||
    message.includes("oauth") ||
    message.includes("password not set") ||
    message.includes("password-based auth") ||
    message.includes("password authentication is disabled") ||
    message.includes("email logins are disabled") ||
    message.includes("sign in with a provider")
  ) {
    return { blocker_code: "password_login_not_available", outcome: "password_login_not_available" };
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return { blocker_code: "email_not_confirmed", outcome: "email_not_confirmed" };
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid email or password")
  ) {
    return { blocker_code: "invalid_credentials", outcome: "invalid_credentials" };
  }

  if (isNetworkAuthError(message)) {
    return { blocker_code: "network_error", outcome: "network_error" };
  }

  return { blocker_code: "auth_failed", outcome: "error" };
}

function buildSupabaseClient(config: P1LiveE2eEnvConfig): SupabaseClient {
  return createClient(config.supabaseUrl.trim(), config.supabaseAnonKey.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function resolveOrganizationSession(
  supabase: SupabaseClient,
  session: Session,
  config: P1LiveE2eEnvConfig,
): Promise<P1LiveE2eAuthResult> {
  const { data: contextRaw, error: contextError } = await supabase.rpc("get_app_organization_context");
  if (contextError) {
    const message = redactSecretsFromMessage(contextError.message);
    return {
      ok: false,
      blocker_code: "auth_failed",
      message,
      diagnostics: buildP1LiveE2eAuthDiagnostics({
        config,
        auth_outcome: "error",
        auth_message: message,
      }),
    };
  }

  const context = (contextRaw ?? {}) as Record<string, unknown>;
  const organizationId =
    typeof context.organization_id === "string" ? context.organization_id : null;
  const tenantId =
    typeof context.customer_id === "string"
      ? context.customer_id
      : typeof context.company_id === "string"
        ? context.company_id
        : organizationId;

  if (!organizationId) {
    return {
      ok: false,
      blocker_code: "organization_context_missing",
      message: "Organization context did not resolve an organization_id after login.",
      diagnostics: buildP1LiveE2eAuthDiagnostics({
        config,
        auth_outcome: "organization_context_missing",
        auth_message: "organization_id missing after login",
      }),
    };
  }

  return {
    ok: true,
    session: {
      supabase,
      session,
      organizationId,
      tenantId,
      userRole: typeof context.user_role === "string" ? context.user_role : "staff",
      organizationReference: anonymizeOrganizationReference(organizationId, config.organizationRef),
    },
    diagnostics: buildP1LiveE2eAuthDiagnostics({
      config,
      auth_outcome: "success",
      auth_message: "password_login_success",
    }),
  };
}

/** Same Supabase project + email/password login path as the APP login form. */
export async function attemptP1LiveAuthenticatedSession(
  config: P1LiveE2eEnvConfig,
): Promise<P1LiveE2eAuthResult> {
  const supabase = buildSupabaseClient(config);
  const email = normalizeP1LiveE2eEmail(config.email);

  let authResponse: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
  try {
    authResponse = await supabase.auth.signInWithPassword({
      email,
      password: config.password,
    });
  } catch (error) {
    const message = redactSecretsFromMessage(
      error instanceof Error ? error.message : "Authenticated login failed.",
    );
    return {
      ok: false,
      blocker_code: isNetworkAuthError(message) ? "network_error" : "auth_failed",
      message,
      diagnostics: buildP1LiveE2eAuthDiagnostics({
        config,
        auth_outcome: isNetworkAuthError(message) ? "network_error" : "error",
        auth_message: message,
      }),
    };
  }

  const { data, error } = authResponse;
  if (error || !data.session) {
    const authError = error ?? ({ message: "Authenticated login failed.", code: "auth_failed" } as AuthError);
    const classified = classifyPasswordLoginError(authError);
    const passwordLength = config.password.trim().length;
    const message =
      classified.blocker_code === "password_login_not_available"
        ? "This account does not support email/password login. Use an APP owner/admin account with password auth enabled."
        : classified.blocker_code === "invalid_credentials" && passwordLength === 0
          ? "APP_LIVE_E2E_PASSWORD is empty after loading .env.local. Add the line and save the file before re-running."
          : classified.blocker_code === "invalid_credentials"
            ? "Supabase rejected the email/password pair for this project. Confirm the same credentials work in APP login at target_host, and that the account uses password auth (not OAuth-only)."
            : redactSecretsFromMessage(authError.message);

    return {
      ok: false,
      blocker_code: classified.blocker_code,
      message,
      diagnostics: buildP1LiveE2eAuthDiagnostics({
        config,
        auth_outcome: classified.outcome,
        auth_message: message,
      }),
    };
  }

  return resolveOrganizationSession(supabase, data.session, config);
}

export async function createP1LiveAuthenticatedSession(
  config: P1LiveE2eEnvConfig,
): Promise<P1LiveE2eAuthenticatedSession> {
  const result = await attemptP1LiveAuthenticatedSession(config);
  if (!result.ok) {
    throw new Error(result.message);
  }
  return result.session;
}

export async function createP1IsolationSession(
  config: P1LiveE2eEnvConfig,
): Promise<P1LiveE2eAuthenticatedSession | null> {
  if (!config.isolationEmail || !config.isolationPassword) return null;

  const supabase = buildSupabaseClient(config);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizeP1LiveE2eEmail(config.isolationEmail),
    password: config.isolationPassword,
  });

  if (error || !data.session) return null;

  const { data: contextRaw } = await supabase.rpc("get_app_organization_context");
  const context = (contextRaw ?? {}) as Record<string, unknown>;
  const organizationId =
    typeof context.organization_id === "string" ? context.organization_id : null;

  if (!organizationId) return null;

  return {
    supabase,
    session: data.session,
    organizationId,
    tenantId:
      typeof context.customer_id === "string"
        ? context.customer_id
        : typeof context.company_id === "string"
          ? context.company_id
          : organizationId,
    userRole: typeof context.user_role === "string" ? context.user_role : "staff",
    organizationReference: anonymizeOrganizationReference(organizationId, null),
  };
}

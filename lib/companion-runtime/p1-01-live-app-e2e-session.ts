import { createHash } from "node:crypto";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";

export type P1LiveE2eAuthenticatedSession = {
  supabase: SupabaseClient;
  session: Session;
  organizationId: string | null;
  tenantId: string | null;
  userRole: string;
  organizationReference: string;
};

const SECRET_PATTERNS = [
  /Bearer\s+[A-Za-z0-9._-]+/gi,
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
];

export function anonymizeOrganizationReference(
  organizationId: string,
  explicitRef: string | null,
): string {
  if (explicitRef?.trim()) return explicitRef.trim();
  const digest = createHash("sha256").update(organizationId).digest("hex").slice(0, 12);
  return `org_${digest}`;
}

export function redactSecretsFromMessage(message: string): string {
  let sanitized = message;
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[redacted]");
  }
  return sanitized.slice(0, 240);
}

export async function createP1LiveAuthenticatedSession(
  config: P1LiveE2eEnvConfig,
): Promise<P1LiveE2eAuthenticatedSession> {
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: config.email,
    password: config.password,
  });

  if (error || !data.session) {
    throw new Error(redactSecretsFromMessage(error?.message ?? "Authenticated login failed."));
  }

  const { data: contextRaw, error: contextError } = await supabase.rpc("get_app_organization_context");
  if (contextError) {
    throw new Error(redactSecretsFromMessage(contextError.message));
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
    throw new Error("Organization context did not resolve an organization_id after login.");
  }

  return {
    supabase,
    session: data.session,
    organizationId,
    tenantId,
    userRole: typeof context.user_role === "string" ? context.user_role : "staff",
    organizationReference: anonymizeOrganizationReference(organizationId, config.organizationRef),
  };
}

export async function createP1IsolationSession(
  config: P1LiveE2eEnvConfig,
): Promise<P1LiveE2eAuthenticatedSession | null> {
  if (!config.isolationEmail || !config.isolationPassword) return null;

  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email: config.isolationEmail,
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

export function assertArtifactContainsNoSecrets(payload: string): boolean {
  for (const pattern of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(payload)) return false;
  }
  return true;
}

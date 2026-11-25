/**
 * Cross-device password recovery / activation links.
 *
 * Root cause of LIVE failure: `resetPasswordForEmail` uses PKCE. The code_verifier
 * stays in the browser that requested the reset, so opening the email on another
 * device (e.g. iPhone while the request was on desktop) fails exchange with
 * flow_state_not_found / bad_code_verifier → "Aipify kunne ikke bekrefte lenken".
 *
 * Fix: admin `generateLink` + `token_hash` verifyOtp path (no PKCE binding).
 * Never log action_link, token_hash, or full recovery URLs.
 */

import {
  AUTH_REDIRECT_PATHS,
  buildAuthRedirectUrl,
} from "@/lib/auth/auth-redirect-urls";
import { buildTokenHashRecoveryUrl } from "@/lib/auth/secure-recovery-link-url";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export { buildTokenHashRecoveryUrl } from "@/lib/auth/secure-recovery-link-url";

export type SecureRecoveryPurpose = "password_reset" | "partner_activation";

export type SecureRecoveryLinkResult =
  | { ok: true; email: string; locale: string | null; redirectPath: string; absoluteUrl: string }
  | { ok: false; reason: "user_not_found" | "link_generation_failed" | "missing_token" | "service_unavailable" };

export type PartnerAuthCapability =
  | { kind: "needs_activation"; email: string; locale: string | null; displayName: string | null }
  | { kind: "credentials_ready"; email: string; locale: string | null; displayName: string | null }
  | { kind: "not_found" }
  | { kind: "error" };

function readMetaLocale(meta: Record<string, unknown> | null | undefined): string | null {
  if (!meta) return null;
  const preferred = meta.preferred_locale;
  const locale = meta.locale;
  if (typeof preferred === "string" && preferred.trim()) return preferred.trim();
  if (typeof locale === "string" && locale.trim()) return locale.trim();
  return null;
}

function readDisplayName(meta: Record<string, unknown> | null | undefined, email: string): string | null {
  if (!meta) return null;
  for (const key of ["full_name", "fullName", "name", "display_name"] as const) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value.trim().slice(0, 120);
  }
  const local = email.split("@")[0];
  return local || null;
}

/**
 * Generate a one-time recovery URL via service role.
 * Callers must never log `absoluteUrl` or token material.
 */
export async function createSecureRecoveryLink(input: {
  email: string;
  purpose: SecureRecoveryPurpose;
  requestHost?: string | null;
  nextPath?: string;
}): Promise<SecureRecoveryLinkResult> {
  const email = input.email.trim().toLowerCase();
  if (!email) return { ok: false, reason: "user_not_found" };

  let admin: ReturnType<typeof createServiceRoleClient>;
  try {
    admin = createServiceRoleClient();
  } catch {
    return { ok: false, reason: "service_unavailable" };
  }

  const nextPath =
    input.nextPath ??
    (input.purpose === "partner_activation"
      ? `/auth/activate?portal=partner`
      : AUTH_REDIRECT_PATHS.updatePassword);

  const redirectTo = buildAuthRedirectUrl(
    AUTH_REDIRECT_PATHS.callback,
    new URLSearchParams({ next: nextPath, type: "recovery" }).toString(),
    { requestHost: input.requestHost },
  );

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (error) {
    const message = (error.message ?? "").toLowerCase();
    if (
      message.includes("user not found") ||
      message.includes("user_not_found") ||
      message.includes("email not found")
    ) {
      return { ok: false, reason: "user_not_found" };
    }
    return { ok: false, reason: "link_generation_failed" };
  }

  const properties = (data?.properties ?? null) as Record<string, unknown> | null;
  const tokenHash =
    (typeof properties?.hashed_token === "string" && properties.hashed_token) ||
    (typeof properties?.email_otp === "string" && properties.email_otp) ||
    "";

  if (!tokenHash) {
    return { ok: false, reason: "missing_token" };
  }

  const user = data?.user;
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const absoluteUrl = buildTokenHashRecoveryUrl(tokenHash, {
    requestHost: input.requestHost,
    nextPath,
  });

  return {
    ok: true,
    email,
    locale: readMetaLocale(meta),
    redirectPath: nextPath,
    absoluteUrl,
  };
}

/** Inspect whether a partner auth user should receive activation vs login CTA. */
export async function inspectPartnerAuthCapability(authUserId: string | null | undefined): Promise<PartnerAuthCapability> {
  if (!authUserId) return { kind: "not_found" };
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.auth.admin.getUserById(authUserId);
    if (error || !data?.user?.email) return { kind: "not_found" };
    const user = data.user;
    const email: string = data.user.email;
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const locale = readMetaLocale(meta);
    const displayName = readDisplayName(meta, email);

    const mustSet =
      meta.must_set_password === true ||
      meta.password_set === false ||
      meta.needs_password_activation === true;
    const neverSignedIn = !user.last_sign_in_at;
    const emailConfirmed = Boolean(user.email_confirmed_at);

    if (mustSet || (neverSignedIn && emailConfirmed) || neverSignedIn) {
      return { kind: "needs_activation", email, locale, displayName };
    }

    return { kind: "credentials_ready", email, locale, displayName };
  } catch {
    return { kind: "error" };
  }
}

/** Persist communication locale on the auth user (non-destructive merge). */
export async function persistAuthPreferredLocale(
  userId: string,
  locale: string | null | undefined,
): Promise<boolean> {
  const normalized = typeof locale === "string" ? locale.trim() : "";
  if (!userId || !normalized) return false;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data?.user) return false;
    const existing = (data.user.user_metadata ?? {}) as Record<string, unknown>;
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...existing,
        preferred_locale: normalized,
        locale: normalized,
      },
    });
    return !updateError;
  } catch {
    return false;
  }
}

import type { KompisCustomerWorkspaceContract, KompisWorkspaceSession } from "./types";

export type PublicToAuthHandoffInput = {
  contract: KompisCustomerWorkspaceContract;
  public_session: {
    session_id: string;
    tenant_id: string;
    locale: string;
    topic_summary?: string | null;
  };
  authenticated_user: {
    user_id: string;
    tenant_id: string;
  };
  now?: Date;
};

export type PublicToAuthHandoffResult =
  | {
      ok: true;
      session: KompisWorkspaceSession;
      preserved_locale: string;
      preserved_topic: string | null;
      dropped_sensitive_assumptions: true;
      message_key: string;
    }
  | { ok: false; code: string; message: string };

/**
 * Secure public → authenticated session handoff.
 * Anonymous claims are never upgraded. New authenticated binding is required.
 */
export function createAuthenticatedHandoffFromPublic(
  input: PublicToAuthHandoffInput
): PublicToAuthHandoffResult {
  const { contract, public_session, authenticated_user } = input;

  if (!contract.enabled || !contract.authenticated_enabled) {
    return { ok: false, code: "auth_surface_disabled", message: "Authenticated workspace is disabled" };
  }
  if (!contract.conversation_handoff_policy.allow_public_to_auth_link) {
    return { ok: false, code: "handoff_disabled", message: "Public-to-auth handoff is disabled" };
  }
  if (public_session.tenant_id !== authenticated_user.tenant_id) {
    return { ok: false, code: "tenant_mismatch", message: "Tenant binding mismatch" };
  }
  if (public_session.tenant_id !== contract.tenant_key) {
    return { ok: false, code: "contract_tenant_mismatch", message: "Contract tenant mismatch" };
  }
  if (!authenticated_user.user_id.trim()) {
    return { ok: false, code: "user_required", message: "Authenticated user binding required" };
  }

  const now = input.now ?? new Date();
  const iso = now.toISOString();
  const session: KompisWorkspaceSession = {
    session_id: `auth_${authenticated_user.user_id}_${now.getTime()}`,
    tenant_id: authenticated_user.tenant_id,
    user_id: authenticated_user.user_id,
    kind: "authenticated",
    linked_public_session_id: public_session.session_id,
    locale: public_session.locale || contract.locale_policy.fallback_locale,
    contract_version: contract.contract_version,
    surface: "authenticated_portal",
    created_at: iso,
    updated_at: iso,
  };

  return {
    ok: true,
    session,
    preserved_locale: session.locale,
    preserved_topic: public_session.topic_summary?.trim() || null,
    dropped_sensitive_assumptions: true,
    message_key: "customerApp.portalStructure.kompisWorkspace.handoff.authenticatedReady",
  };
}

/** On logout: authenticated tools must be removed immediately. */
export function downgradeSessionOnLogout(session: KompisWorkspaceSession): {
  kind: "public";
  authenticated_tools_removed: true;
  user_id: null;
  linked_public_session_id: string | null;
} {
  return {
    kind: "public",
    authenticated_tools_removed: true,
    user_id: null,
    linked_public_session_id: session.linked_public_session_id,
  };
}

/**
 * Workspace store for the Support firm signature.
 *
 * In-process (same model as template-store): survives page loads while the
 * server process lives, but is NOT durable Core storage. Durable persistence
 * stays gated (`SUPPORT_SIGNATURE_PERSIST_CONFIGURED = false`) until an
 * owner-approved Core CRUD RPC exists. Never claims Core persistence.
 */

import {
  createDefaultSupportSignature,
  SUPPORT_SIGNATURE_LOGO_URL,
  SUPPORT_SIGNATURE_PERSIST_CONFIGURED,
  type SupportSignatureDraft,
} from "./signature";

type StoreState = {
  /** null = using company defaults (nothing saved yet). */
  saved: SupportSignatureDraft | null;
};

const globalStore = globalThis as typeof globalThis & {
  __aipifySupportSignatureStore?: StoreState;
};

function ensureStore(): StoreState {
  if (!globalStore.__aipifySupportSignatureStore) {
    globalStore.__aipifySupportSignatureStore = { saved: null };
  }
  return globalStore.__aipifySupportSignatureStore;
}

export type StoredSupportSignature = {
  signature: SupportSignatureDraft;
  /** True when a workspace signature has been saved (not just defaults). */
  customized: boolean;
  /** Durable Core persistence — false until Core CRUD RPCs are applied. */
  persistConfigured: boolean;
};

export function getStoredSupportSignature(): StoredSupportSignature {
  const { saved } = ensureStore();
  return {
    signature: saved ? { ...saved } : createDefaultSupportSignature(),
    customized: saved !== null,
    persistConfigured: SUPPORT_SIGNATURE_PERSIST_CONFIGURED,
  };
}

export type SupportSignatureMutationResult =
  | ({ ok: true } & StoredSupportSignature)
  | { ok: false; error: string };

const MAX_FIELD = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORBIDDEN_DOMAIN_RE = /(^|[@.])aipify\.com$/i;

function cleanField(value: unknown, max = MAX_FIELD): string {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function cleanHttpUrl(value: unknown): string | null {
  const raw = cleanField(value, 300);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (FORBIDDEN_DOMAIN_RE.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Validate + normalise client input into a safe signature draft. */
export function sanitizeSupportSignatureInput(
  input: unknown,
  previousVersion = 0,
): { ok: true; value: SupportSignatureDraft } | { ok: false; error: string } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "validation" };
  }
  const raw = input as Record<string, unknown>;

  const supportEmail = cleanField(raw.supportEmail, 160).toLowerCase();
  if (supportEmail) {
    if (!EMAIL_RE.test(supportEmail) || FORBIDDEN_DOMAIN_RE.test(supportEmail)) {
      return { ok: false, error: "invalid_support_email" };
    }
  }
  const websiteUrl = cleanHttpUrl(raw.websiteUrl);
  if (websiteUrl === null) return { ok: false, error: "invalid_website" };

  const companyName = cleanField(raw.companyName, 160);
  const displayName = cleanField(raw.displayName, 120);
  if (!companyName && !displayName) {
    return { ok: false, error: "name_required" };
  }

  const defaults = createDefaultSupportSignature();
  return {
    ok: true,
    value: {
      displayName,
      agentName: cleanField(raw.agentName, 120),
      agentTitle: cleanField(raw.agentTitle, 120),
      companyName,
      websiteUrl,
      supportEmail,
      phone: cleanField(raw.phone, 60),
      addressLine: cleanField(raw.addressLine, 240),
      // Only the official brand logo is allowed — never a client-supplied URL.
      logoUrl: SUPPORT_SIGNATURE_LOGO_URL,
      includeLogo: raw.includeLogo !== false,
      active: raw.active !== false,
      version: Math.max(previousVersion, defaults.version) + (previousVersion > 0 ? 1 : 0),
    },
  };
}

export function saveSupportSignature(input: unknown): SupportSignatureMutationResult {
  const store = ensureStore();
  const result = sanitizeSupportSignatureInput(input, store.saved?.version ?? 0);
  if (!result.ok) return result;
  store.saved = result.value;
  return { ok: true, ...getStoredSupportSignature() };
}

/** Drop the saved workspace signature — company defaults apply again. */
export function resetSupportSignature(): SupportSignatureMutationResult {
  ensureStore().saved = null;
  return { ok: true, ...getStoredSupportSignature() };
}

/** Reset store — tests only. */
export function __resetSupportSignatureStoreForTests(): void {
  globalStore.__aipifySupportSignatureStore = undefined;
}

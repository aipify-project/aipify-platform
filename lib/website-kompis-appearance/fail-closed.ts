/**
 * Fail-closed appearance adapter — no fake save while Core writer is missing.
 */

import {
  WEBSITE_KOMPIS_APPEARANCE_ACCENT_TOKENS,
  WEBSITE_KOMPIS_APPEARANCE_LIMITS,
  type WebsiteKompisAppearanceAccentToken,
  type WebsiteKompisAppearanceReadResult,
  type WebsiteKompisAppearanceWriteResult,
} from "./types";

export function isWebsiteKompisAppearanceAccentToken(
  value: string,
): value is WebsiteKompisAppearanceAccentToken {
  return (WEBSITE_KOMPIS_APPEARANCE_ACCENT_TOKENS as readonly string[]).includes(value);
}

export function validateWebsiteKompisAppearanceDraft(input: {
  accentToken: string;
  welcomeMessage: string | null | undefined;
  showBranding: boolean;
}): { ok: true } | { ok: false; messageKey: string } {
  if (!isWebsiteKompisAppearanceAccentToken(input.accentToken)) {
    return { ok: false, messageKey: "invalidAccent" };
  }
  const welcome = input.welcomeMessage ?? null;
  if (welcome != null && welcome.length > WEBSITE_KOMPIS_APPEARANCE_LIMITS.welcomeMessageMaxChars) {
    return { ok: false, messageKey: "welcomeTooLong" };
  }
  if (typeof input.showBranding !== "boolean") {
    return { ok: false, messageKey: "invalidBranding" };
  }
  return { ok: true };
}

/**
 * Until Core RPCs exist and owner activates them, every read/write is fail-closed.
 * Never invents settings or reports success.
 */
export function readWebsiteKompisAppearanceFailClosed(): WebsiteKompisAppearanceReadResult {
  return { kind: "writer_unavailable", reason: "core_rpc_missing" };
}

export function writeWebsiteKompisAppearanceFailClosed(
  draft: {
    accentToken: string;
    welcomeMessage: string | null | undefined;
    showBranding: boolean;
  },
): WebsiteKompisAppearanceWriteResult {
  const valid = validateWebsiteKompisAppearanceDraft(draft);
  if (!valid.ok) {
    return { ok: false, reason: "validation_failed", messageKey: valid.messageKey };
  }
  return {
    ok: false,
    reason: "writer_unavailable",
    messageKey: "writerUnavailable",
  };
}

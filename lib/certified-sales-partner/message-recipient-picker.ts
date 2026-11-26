/**
 * Platform Admin message recipient helpers — searchable partner directory for compose.
 * Pure / client-safe. Eligibility mirrors portal allowlist (approved/active/certified/in_academy).
 * Keep this module free of server/service-role imports so unit tests stay lightweight.
 */

export type CspMessageRecipient = {
  id: string;
  displayName: string | null;
  status: string;
  country: string | null;
};

/** Same set as `CSP_PARTNER_PORTAL_ALLOWED_STATUSES` — duplicated to stay client/test safe. */
export const CSP_MESSAGE_ELIGIBLE_STATUSES = [
  "approved",
  "active",
  "certified",
  "in_academy",
] as const;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isCspMessageRecipientEligible(status: unknown): boolean {
  return (
    typeof status === "string" &&
    (CSP_MESSAGE_ELIGIBLE_STATUSES as readonly string[]).includes(status)
  );
}

export function parseCspMessageRecipients(payload: unknown): CspMessageRecipient[] {
  if (!payload || typeof payload !== "object") return [];
  const raw = (payload as { partners?: unknown }).partners;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return [];
    const r = row as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id.trim() : "";
    if (!id || !UUID_RE.test(id)) return [];
    const status =
      typeof r.status === "string" && r.status.trim()
        ? r.status.trim()
        : typeof r.partner_status === "string"
          ? r.partner_status.trim()
          : "unknown";
    const displayName =
      (typeof r.display_name === "string" && r.display_name.trim()
        ? r.display_name.trim()
        : null) ??
      (typeof r.displayName === "string" && r.displayName.trim() ? r.displayName.trim() : null);
    const country =
      (typeof r.country === "string" && r.country.trim() ? r.country.trim() : null) ?? null;
    return [{ id, displayName, status, country }];
  });
}

/** Case-insensitive match on name, status, country, or id fragment (never require full UUID paste). */
export function filterCspMessageRecipients(
  recipients: readonly CspMessageRecipient[],
  query: string,
): CspMessageRecipient[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...recipients];
  return recipients.filter((r) => {
    const name = (r.displayName ?? "").toLowerCase();
    const status = r.status.toLowerCase();
    const country = (r.country ?? "").toLowerCase();
    const id = r.id.toLowerCase();
    return name.includes(q) || status.includes(q) || country.includes(q) || id.includes(q);
  });
}

export function recipientDisplayLabel(
  recipient: CspMessageRecipient,
  unnamed: string,
): string {
  return recipient.displayName?.trim() || unnamed;
}

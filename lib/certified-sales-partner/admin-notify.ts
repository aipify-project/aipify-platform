import {
  deliverCspOnboardingEmailThrottled,
  type CspOnboardingEmailOutcome,
} from "./onboarding-email";

/**
 * Optional comma-separated Platform Admin notify list for new CSP applications.
 * Never invent recipients. Empty / unset → no admin mail (reported as `no_recipients`).
 */
export function resolveCspAdminNotifyEmails(
  raw: string | undefined = process.env.CSP_ADMIN_NOTIFY_EMAILS,
): string[] {
  if (!raw?.trim()) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[,;\s]+/)) {
    const email = part.trim().toLowerCase();
    if (!email || !email.includes("@") || email.length > 254) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push(email);
    if (out.length >= 20) break;
  }
  return out;
}

export type CspAdminNotifyResult = {
  outcome: CspOnboardingEmailOutcome | "no_recipients";
  recipientCount: number;
};

/**
 * Notify configured Platform Admins that a new application arrived.
 * Body contains no sensitive personal details beyond display name + country + status label.
 */
export async function notifyCspAdminsOfNewApplication(input: {
  partnerId: string;
  displayName: string | null;
  country: string | null;
  locale?: string | null;
}): Promise<CspAdminNotifyResult> {
  const recipients = resolveCspAdminNotifyEmails();
  if (recipients.length === 0) return { outcome: "no_recipients", recipientCount: 0 };

  const applicant = (input.displayName ?? "").trim().slice(0, 120);
  const country = (input.country ?? "").trim().toUpperCase().slice(0, 2) || null;
  const reason = [
    applicant ? `Applicant: ${applicant}` : null,
    country ? `Country: ${country}` : null,
    `Reference: ${input.partnerId.slice(0, 8)}…`,
  ]
    .filter(Boolean)
    .join(" · ");
  let worst: CspOnboardingEmailOutcome = "accepted";

  for (const to of recipients) {
    const { outcome } = await deliverCspOnboardingEmailThrottled({
      kind: "admin_new_application",
      to,
      locale: input.locale ?? "en",
      // Do not greet admins with the applicant name.
      vars: { reason },
      idempotencyKey: `csp-admin_new_application-${input.partnerId}-${to}`,
    });
    if (outcome === "not_configured") return { outcome: "not_configured", recipientCount: recipients.length };
    if (outcome === "failed") worst = "failed";
    else if (outcome === "rate_limited" && worst === "accepted") worst = "rate_limited";
  }

  return { outcome: worst, recipientCount: recipients.length };
}

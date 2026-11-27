/**
 * Customer-facing License Center presentation helpers.
 * Never show raw Core enums (`pending_setup`) or treat agreement names as product plans.
 */

import { renewalPresentation } from "@/lib/commercial-packages/portfolio-presentation";

export type LicensePaymentDisplay =
  | { kind: "lifetime"; labelKey: "lifetimeAgreement" }
  | { kind: "mapped"; labelKey: "paymentActive" | "paymentPendingSetup" | "paymentPaused" | "paymentUnknown" }
  | { kind: "raw_blocked"; labelKey: "paymentUnknown" };

export function presentLicensePaymentStatus(input: {
  paymentStatus: string | null | undefined;
  licenseStatus: string | null | undefined;
  planName: string | null | undefined;
  renewalDate: string | null | undefined;
}): LicensePaymentDisplay {
  const renewal = renewalPresentation({
    statusKey: input.paymentStatus ?? null,
    licenseStatus: input.licenseStatus ?? null,
    renewalDate: input.renewalDate ?? null,
    planName: input.planName,
  });
  if (renewal === "lifetime") {
    return { kind: "lifetime", labelKey: "lifetimeAgreement" };
  }

  const payment = (input.paymentStatus ?? "").trim().toLowerCase();
  if (!payment || payment === "—" || payment === "null") {
    return { kind: "raw_blocked", labelKey: "paymentUnknown" };
  }
  if (payment === "pending_setup" || payment === "pending") {
    return { kind: "mapped", labelKey: "paymentPendingSetup" };
  }
  if (payment === "active" || payment === "paid" || payment === "current") {
    return { kind: "mapped", labelKey: "paymentActive" };
  }
  if (payment === "paused" || payment === "past_due") {
    return { kind: "mapped", labelKey: "paymentPaused" };
  }
  return { kind: "raw_blocked", labelKey: "paymentUnknown" };
}

export function presentLicenseStatusLabelKey(
  licenseStatus: string | null | undefined,
): "licenseActive" | "licenseLifetime" | "licensePaused" | "licenseGrace" | "licenseUnknown" {
  const status = (licenseStatus ?? "").trim().toLowerCase();
  if (status === "lifetime") return "licenseLifetime";
  if (status === "active") return "licenseActive";
  if (status === "paused") return "licensePaused";
  if (status === "grace_period" || status === "grace") return "licenseGrace";
  return "licenseUnknown";
}

/**
 * Agreement / contract display name (may be workspace-specific).
 * Never silently relabel as the software product plan.
 */
export function presentAgreementName(planName: string | null | undefined): string | null {
  const name = (planName ?? "").trim();
  return name.length > 0 ? name : null;
}

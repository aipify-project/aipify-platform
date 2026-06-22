import type { NormalizedVerificationStatus } from "./types";

/** Normalize provider-specific status strings — Core never exposes raw enums. */
export function normalizeVerificationStatus(raw: string | null | undefined): NormalizedVerificationStatus {
  const value = String(raw ?? "").trim().toLowerCase();
  if (!value) return "pending";

  if (
    value.includes("need") &&
    (value.includes("info") || value.includes("information") || value.includes("document"))
  ) {
    return "needs_information";
  }
  if (value.includes("review") || value.includes("processing") || value.includes("assigned")) {
    return "in_review";
  }
  if (value.includes("approve") || value === "verified" || value === "complete") {
    return "approved";
  }
  if (value.includes("reject") || value.includes("denied") || value === "failed") {
    return "rejected";
  }
  if (value.includes("expir")) return "expired";
  if (value.includes("cancel") || value.includes("withdraw")) return "cancelled";
  if (value.includes("pending") || value === "open" || value === "new") return "pending";

  return "pending";
}

export function verificationStatusI18nKey(status: NormalizedVerificationStatus): string {
  return `customerApp.companionPlatformKnowledge.verification.status.${status}`;
}

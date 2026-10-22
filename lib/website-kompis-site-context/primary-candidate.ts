/**
 * A website is the primary candidate only when the stored domain is verified
 * and active. A primary flag on a pending organization domain is not proof.
 */
export function ownedSiteIsVerifiedActive(input: {
  verificationStatus?: string | null;
  domainStatus?: string | null;
}): boolean {
  return input.verificationStatus === "verified" && input.domainStatus === "active";
}

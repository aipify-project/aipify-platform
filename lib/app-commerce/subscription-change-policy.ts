import type { CommerceSubscriptionChangePolicy } from "./types";

/**
 * Upgrade/downgrade/cancel policy is not owner-finalized for self-serve commerce.
 * APP stays read-only / fail-closed until an explicit commercial decision ships.
 */
export function getCommerceSubscriptionChangePolicy(): CommerceSubscriptionChangePolicy {
  return {
    allowed: false,
    reason: "policy_not_finalized",
    mode: "read_only_fail_closed",
  };
}

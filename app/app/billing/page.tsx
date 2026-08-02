import { redirect } from "next/navigation";

/**
 * Legacy /app/billing shell used UnifiedBillingCenterPanel, which collapsed to a
 * single empty string when the STABLE unified-billing RPC attempted a seed INSERT
 * inside a read-only transaction.
 *
 * Authoritative customer billing surface is /app/settings/billing (commercial packages).
 */
export default function BillingAliasPage() {
  redirect("/app/settings/billing");
}

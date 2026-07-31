import { redirect } from "next/navigation";

/** Portal billing shell redirects to authoritative billing center. */
export default function BillingSubscriptionPage() {
  redirect("/app/settings/billing");
}

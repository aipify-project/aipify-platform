import { redirect } from "next/navigation";

/** Upgrade shell is not production-ready — send users to billing overview. */
export default function BillingUpgradePage() {
  redirect("/app/settings/billing");
}

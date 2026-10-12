import { redirect } from "next/navigation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/** Legacy billing path — Account Center subscription is canonical. */
export default function LegacyBillingSettingsRedirect() {
  redirect(FOUNDATION_NAV_BINDINGS.accountSubscription);
}

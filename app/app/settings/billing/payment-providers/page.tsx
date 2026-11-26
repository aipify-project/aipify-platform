import { redirect } from "next/navigation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/**
 * Payment providers are not an APP customer purchase destination.
 * Platform operators manage providers under /platform/billing/payment-providers.
 */
export default function CustomerPaymentProvidersPage() {
  redirect(FOUNDATION_NAV_BINDINGS.accountSubscription);
}

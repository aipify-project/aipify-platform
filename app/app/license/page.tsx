import { redirect } from "next/navigation";
import { subscriptionTabHref } from "@/lib/commercial-packages/subscription-tabs";

/** Deep-link preserved — License Center lives as a tab inside Abonnement. */
export default function AppLicensePage() {
  redirect(subscriptionTabHref("license"));
}

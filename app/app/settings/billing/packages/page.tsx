import { redirect } from "next/navigation";
import { subscriptionTabHref } from "@/lib/commercial-packages/subscription-tabs";

/** Deep-link preserved — product store lives as a tab inside Abonnement. */
export default function PackageAccessSettingsPage() {
  redirect(subscriptionTabHref("store"));
}

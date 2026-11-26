import { redirect } from "next/navigation";
import { subscriptionTabHref } from "@/lib/commercial-packages/subscription-tabs";

/** Deep-link preserved — add-on modules live as a tab inside Abonnement. */
export default function ModulesSettingsPage() {
  redirect(subscriptionTabHref("addons"));
}

import { redirect } from "next/navigation";
import { subscriptionTabHref } from "@/lib/commercial-packages/subscription-tabs";

/** Legacy Tilleggsmoduler URL — redirect to Produktbutikk (no 404). */
export default function ModulesSettingsPage() {
  redirect(subscriptionTabHref("store"));
}

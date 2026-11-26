import { redirect } from "next/navigation";
import { subscriptionTabHref } from "@/lib/commercial-packages/subscription-tabs";

/** Deep-link preserved — invoices live as a tab inside Abonnement. */
export default function AccountInvoicesPage() {
  redirect(subscriptionTabHref("invoices"));
}

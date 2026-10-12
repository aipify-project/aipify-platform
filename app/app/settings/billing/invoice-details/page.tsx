import { redirect } from "next/navigation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/** Legacy invoice-details path — Account Center invoices is canonical. */
export default function LegacyInvoiceDetailsRedirect() {
  redirect(FOUNDATION_NAV_BINDINGS.accountInvoices);
}

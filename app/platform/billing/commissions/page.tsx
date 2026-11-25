import { redirect } from "next/navigation";

/**
 * Legacy customer-billing path for seller commissions.
 * Seller finance belongs under /platform/sellers/* so the customer Kundeøkonomi
 * sub-nav (invoices, VAT, agreements) is never shown for this work.
 */
export default function PlatformBillingCommissionsRedirectPage() {
  redirect("/platform/sellers/commissions");
}

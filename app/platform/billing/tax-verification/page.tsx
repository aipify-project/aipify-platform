import { redirect } from "next/navigation";

export default function PlatformBillingTaxVerificationRedirectPage() {
  redirect("/platform/billing/vat-engine");
}

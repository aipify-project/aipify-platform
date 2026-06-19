import { redirect } from "next/navigation";

export default function PlatformInvoicesRedirectPage() {
  redirect("/platform/billing/invoices");
}

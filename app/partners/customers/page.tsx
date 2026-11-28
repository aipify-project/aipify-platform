import { redirect } from "next/navigation";

/** Additive root — Phase A documented missing page; keep /partners alive. */
export default function PartnersCustomersRootPage() {
  redirect("/partners/customers/prospects");
}

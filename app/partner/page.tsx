import { redirect } from "next/navigation";
import { PARTNER_PORTAL_HOME } from "@/lib/partner-portal/nav-config";

export default function PartnerRootPage() {
  redirect(PARTNER_PORTAL_HOME);
}

import { redirect } from "next/navigation";
import { GROWTH_PARTNER_PORTAL_HOME } from "@/lib/growth-partner-portal/nav-config";

export default function GrowthPartnerPortalIndexPage() {
  redirect(GROWTH_PARTNER_PORTAL_HOME);
}

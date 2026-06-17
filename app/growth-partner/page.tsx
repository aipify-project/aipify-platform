import { redirect } from "next/navigation";
import { getPartnerLegacyRedirect } from "@/lib/partner-portal/nav-config";

export default function GrowthPartnerRootRedirectPage() {
  redirect(getPartnerLegacyRedirect("/growth-partner") ?? "/partner/dashboard");
}

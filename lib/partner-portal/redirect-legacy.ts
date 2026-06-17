import { redirect } from "next/navigation";
import { getPartnerLegacyRedirect } from "@/lib/partner-portal/nav-config";

export function redirectGrowthPartnerLegacy(pathname: string): never {
  redirect(getPartnerLegacyRedirect(pathname) ?? "/partner/dashboard");
}

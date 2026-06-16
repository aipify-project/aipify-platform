import { redirect } from "next/navigation";
import { getPartnersLegacyRedirect } from "@/lib/partners-portal/nav-config";

/** @deprecated Use redirectPartnersLegacy from partners-portal */
export function redirectGrowthLegacy(pathname: string): never {
  redirect(getPartnersLegacyRedirect(pathname) ?? "/partners");
}

export { redirectPartnersLegacy } from "@/lib/partners-portal/redirect-legacy";

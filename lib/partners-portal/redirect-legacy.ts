import { redirect } from "next/navigation";
import { getPartnersLegacyRedirect } from "@/lib/partners-portal/nav-config";

type GrowthPartnerLegacyRedirectProps = {
  pathname: string;
};

export function redirectPartnersLegacy(pathname: string): never {
  redirect(getPartnersLegacyRedirect(pathname) ?? "/partners");
}

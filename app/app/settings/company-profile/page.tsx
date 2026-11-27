import { redirect } from "next/navigation";
import { ACCOUNT_PROFILE_ROUTE } from "@/lib/app/account-profile";

export const dynamic = "force-dynamic";

/**
 * Unified customer profile: organization settings open the same Kundeforhold
 * company tab instead of a competing locked form.
 */
export default function CompanyProfileSettingsPage() {
  redirect(`${ACCOUNT_PROFILE_ROUTE}?tab=company`);
}

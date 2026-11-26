import { ACCOUNT_PROFILE_ROUTE } from "@/lib/app/account-profile";
import { parseAccountProfileTab, ACCOUNT_PROFILE_TABS } from "@/lib/app/account-profile/tabs";
import { redirect } from "next/navigation";

/** Legacy account profile URL. Canonical surface is /app/profile. */
export default async function LegacyAccountProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = parseAccountProfileTab(params.tab);
  const query = params.tab && ACCOUNT_PROFILE_TABS.includes(tab) && params.tab === tab ? `?tab=${tab}` : "";
  redirect(`${ACCOUNT_PROFILE_ROUTE}${query}`);
}

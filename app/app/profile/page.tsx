import { CustomerProfilePanel } from "@/components/app/customer-profile/CustomerProfilePanel";
import { loadCustomerProfile } from "@/lib/app/customer-profile/load";
import type { CustomerProfileRole, CustomerProfileStatus } from "@/lib/app/customer-profile/model";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ROLES: CustomerProfileRole[] = ["owner", "admin", "support", "staff", "read_only", "member"];
const STATUSES: CustomerProfileStatus[] = ["active", "paused", "grace", "trialing", "cancelled"];

export default async function CustomerProfilePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const p = "customerApp.settings.customerProfile";
  const supabase = await createClient();
  const view = await loadCustomerProfile(supabase);
  if (!view) {
    redirect("/login?next=/app/profile");
  }

  return (
    <CustomerProfilePanel
      view={view}
      locale={locale}
      labels={{
        eyebrow: t(`${p}.eyebrow`),
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        profileTitle: t(`${p}.profileTitle`),
        relationshipTitle: t(`${p}.relationshipTitle`),
        fullName: t(`${p}.fullName`),
        role: t(`${p}.role`),
        address: t(`${p}.address`),
        email: t(`${p}.email`),
        phone: t(`${p}.phone`),
        website: t(`${p}.website`),
        workspace: t(`${p}.workspace`),
        plan: t(`${p}.plan`),
        status: t(`${p}.status`),
        reference: t(`${p}.reference`),
        created: t(`${p}.created`),
        updated: t(`${p}.updated`),
        unavailable: t(`${p}.unavailable`),
        notRegistered: t(`${p}.notRegistered`),
        photoNote: t(`${p}.photoNote`),
        actionsTitle: t(`${p}.actionsTitle`),
        editProfile: t(`${p}.editProfile`),
        updateContact: t(`${p}.updateContact`),
        changePhoto: t(`${p}.changePhoto`),
        privacy: t(`${p}.privacy`),
        actionBlocked: t(`${p}.actionBlocked`),
        lockTitle: t(`${p}.lockTitle`),
        lockBody: t(`${p}.lockBody`),
        lockStatus: t(`${p}.lockStatus`),
        roles: Object.fromEntries(ROLES.map((role) => [role, t(`${p}.roles.${role}`)])) as Record<
          CustomerProfileRole,
          string
        >,
        statuses: Object.fromEntries(STATUSES.map((status) => [status, t(`${p}.statuses.${status}`)])) as Record<
          CustomerProfileStatus,
          string
        >,
        statusUnknown: t(`${p}.statusUnknown`),
        dateEmpty: t(`${p}.dateEmpty`),
        dateInvalid: t(`${p}.dateInvalid`),
      }}
    />
  );
}

import { CompanyProfilePanel } from "@/components/app/settings/CompanyProfilePanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { buildCompanyProfileView } from "@/lib/app/settings/company-profile-view";
import { requireAppSettingsOwnerAdminAccess } from "@/lib/app/settings/require-settings-owner-admin";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CompanyProfileSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings", "portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const p = "customerApp.settings.companyProfile";
  const supabase = await createClient();
  const access = await requireAppSettingsOwnerAdminAccess(supabase);

  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      redirect("/login?next=/app/settings/company-profile");
    }
    return (
      <div className="mx-auto max-w-3xl p-6">
        <PlatformEmptyState
          title={t("customerApp.settings.organizationSettingsAccess.deniedTitle")}
          message={t("customerApp.settings.organizationSettingsAccess.deniedBody")}
          primaryAction={{
            label: t("customerApp.settings.organizationSettingsAccess.backToApp"),
            href: "/app",
          }}
        />
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const view = buildCompanyProfileView(access.context, user?.email ?? null);

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.settings.operativeTitle"), href: "/app/settings" },
        { label: t(`${p}.title`) },
      ]}
      eyebrow={t("customerApp.settings.operativeTitle")}
      title={t(`${p}.title`)}
      description={t(`${p}.subtitle`)}
    >
      <CompanyProfilePanel
        view={view}
        labels={{
          businessTitle: t(`${p}.businessTitle`),
          contactTitle: t(`${p}.contactTitle`),
          systemTitle: t(`${p}.systemTitle`),
          securityTitle: t(`${p}.securityTitle`),
          locked: t(`${p}.locked`),
          organizationName: t(`${p}.organizationName`),
          loginEmail: t(`${p}.loginEmail`),
          role: t(`${p}.role`),
          plan: t(`${p}.plan`),
          license: t(`${p}.license`),
          contactUnavailable: t(`${p}.contactUnavailable`),
          logoUnavailable: t(`${p}.logoUnavailable`),
          emptyName: t(`${p}.emptyName`),
          roles: {
            owner: t(`${p}.roles.owner`),
            admin: t(`${p}.roles.admin`),
            member: t(`${p}.roles.member`),
          },
          licenses: {
            active: t(`${p}.licenses.active`),
            paused: t(`${p}.licenses.paused`),
            grace: t(`${p}.licenses.grace`),
            trialing: t(`${p}.licenses.trialing`),
            cancelled: t(`${p}.licenses.cancelled`),
          },
          securityLinks: [
            { href: "/app/settings/two-factor", label: t(`${p}.securityLinks.signIn`) },
            { href: "/app/settings/security", label: t(`${p}.securityLinks.security`) },
          ],
        }}
      />
    </AppHubShell>
  );
}

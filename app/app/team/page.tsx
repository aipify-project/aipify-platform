import { TeamCenterPanel } from "@/components/app/team/TeamCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TeamPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "dashboard", "branding"]);
  const t = createTranslator(dict);

  return (
    <TeamCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.team.title"),
        subtitle: t("customerApp.team.subtitle"),
        loading: t("customerApp.team.loading"),
        empty: t("customerApp.team.empty"),
        pulseLabel: t("branding.pulseLabel"),
        members: t("customerApp.team.members"),
        invitations: t("customerApp.team.invitations"),
        noInvitations: t("customerApp.team.noInvitations"),
        columns: {
          name: t("customerApp.team.columns.name"),
          email: t("customerApp.team.columns.email"),
          role: t("customerApp.team.columns.role"),
          status: t("customerApp.team.columns.status"),
        },
        roleLabels: {
          owner: t("dashboard.roles.owner"),
          admin: t("dashboard.roles.admin"),
          support: t("dashboard.roles.support"),
          staff: t("dashboard.roles.staff"),
          read_only: t("dashboard.roles.read_only"),
          manager: t("dashboard.roles.admin"),
          viewer: t("dashboard.roles.read_only"),
        },
        inviteSoon: t("customerApp.team.inviteSoon"),
      }}
    />
  );
}

import { OrganizationPanel } from "@/components/app/organizational-intelligence/OrganizationPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <OrganizationPanel
      labels={{
        title: t("customerApp.organization.title"),
        subtitle: t("customerApp.organization.subtitle"),
        loading: t("customerApp.organization.loading"),
        back: t("customerApp.organization.back"),
        units: t("customerApp.organization.units"),
        responsibilities: t("customerApp.organization.responsibilities"),
        emptyUnits: t("customerApp.organization.emptyUnits"),
        emptyResponsibilities: t("customerApp.organization.emptyResponsibilities"),
        addUnit: t("customerApp.organization.addUnit"),
        addResponsibility: t("customerApp.organization.addResponsibility"),
        save: t("customerApp.organization.save"),
        insightsLink: t("customerApp.organization.insightsLink"),
      }}
    />
  );
}

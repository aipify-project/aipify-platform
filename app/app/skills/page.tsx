import { SkillStorePanel } from "@/components/app/skills";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppSkillsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <SkillStorePanel
      mode="catalog"
      labels={{
        title: t("customerApp.skillStore.title"),
        subtitle: t("customerApp.skillStore.subtitle"),
        loading: t("customerApp.skillStore.loading"),
        empty: t("customerApp.skillStore.catalogEmpty"),
        catalog: t("customerApp.skillStore.catalog"),
        installed: t("customerApp.skillStore.installed"),
        installedTitle: t("customerApp.skillStore.installedTitle"),
        history: t("customerApp.skillStore.history"),
        allCategories: t("customerApp.skillStore.allCategories"),
        install: t("customerApp.skillStore.install"),
        installWithApproval: t("customerApp.skillStore.installWithApproval"),
        installedBadge: t("customerApp.skillStore.installedBadge"),
        planRequired: t("customerApp.skillStore.planRequired"),
        review: t("customerApp.skillStore.review"),
        privacy: t("customerApp.skillStore.privacy"),
      }}
    />
  );
}

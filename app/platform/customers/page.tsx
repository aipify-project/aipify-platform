import CustomersPanel from "@/components/platform/CustomersPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <CustomersPanel
      labels={{
        title: t("platform.customers.title"),
        subtitle: t("platform.customers.subtitle"),
        loading: t("platform.customers.loading"),
        empty: t("platform.customers.empty"),
        installations: t("platform.customers.installations"),
        users: t("platform.customers.users"),
        pilotNote: t("platform.customers.pilotNote"),
      }}
    />
  );
}

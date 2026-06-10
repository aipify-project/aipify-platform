import CustomersTable from "@/components/platform/CustomersTable";
import {
  customerStatusLabels,
  customerTypeLabels,
} from "@/lib/platform/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <CustomersTable
      labels={{
        title: t("platform.customers.title"),
        subtitle: t("platform.customers.subtitle"),
        loading: t("platform.customers.loading"),
        empty: t("platform.customers.empty"),
        customerNumber: t("platform.customers.customerNumber"),
        name: t("platform.customers.name"),
        email: t("platform.customers.email"),
        country: t("platform.customers.country"),
        status: t("platform.customers.status"),
        installations: t("platform.customers.installations"),
        created: t("platform.customers.created"),
        view: t("platform.customers.view"),
        statusLabels: customerStatusLabels(t),
        typeLabels: customerTypeLabels(t),
      }}
    />
  );
}

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
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <CustomersTable
      locale={locale}
      labels={{
        title: t("platform.customers.title"),
        subtitle: t("platform.customers.subtitle"),
        loading: t("platform.customers.loading"),
        empty: t("platform.customers.empty"),
        search: t("platform.customers.search"),
        filterStatus: t("platform.customers.filterStatus"),
        filterType: t("platform.customers.filterType"),
        filterAll: t("platform.customers.filterAll"),
        customerNumber: t("platform.customers.customerNumber"),
        name: t("platform.customers.name"),
        type: t("platform.customers.type"),
        plan: t("platform.customers.plan"),
        status: t("platform.customers.status"),
        trialRemaining: t("platform.customers.trialRemaining"),
        installations: t("platform.customers.installations"),
        users: t("platform.customers.users"),
        country: t("platform.customers.country"),
        created: t("platform.customers.created"),
        actions: t("platform.customers.actions"),
        view: t("platform.customers.view"),
        days: t("platform.customers.days"),
        statusLabels: customerStatusLabels(t),
        typeLabels: customerTypeLabels(t),
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}

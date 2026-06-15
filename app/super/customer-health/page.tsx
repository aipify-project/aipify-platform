import { CustomerHealthPanel } from "@/components/super-admin/customer-health";
import { buildCustomerHealthLabels } from "@/lib/customer-health-early-warning";
import { SUPER_ADMIN_HOME_ROUTE } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminCustomerHealthPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return (
    <CustomerHealthPanel
      labels={buildCustomerHealthLabels(t)}
      backHref={SUPER_ADMIN_HOME_ROUTE}
    />
  );
}

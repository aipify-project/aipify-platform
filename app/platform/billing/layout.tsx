import { BillingCommerceSubNav } from "@/components/platform/billing";
import { BILLING_COMMERCE_NAV } from "@/lib/platform/billing-commerce-center/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <BillingCommerceSubNav
        overviewLabel={t("platform.billingCommerceCenter.nav.overview")}
        items={BILLING_COMMERCE_NAV.map((item) => ({
          id: item.id,
          href: item.href,
          label: t(item.labelKey),
        }))}
      />
      {children}
    </div>
  );
}

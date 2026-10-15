import { BillingCommerceSubNav } from "@/components/platform/billing";
import { PlatformPageFrame } from "@/components/platform/PlatformPageFrame";
import {
  BILLING_COMMERCE_NAV_GROUPS,
  getBillingCommercePrimaryNav,
} from "@/lib/platform/billing-commerce-center/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformBillingLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const primaryNav = getBillingCommercePrimaryNav();

  return (
    <PlatformPageFrame tight>
      <BillingCommerceSubNav
        ariaLabel={t("platform.billingCommerceCenter.subNavAria")}
        overviewLabel={t("platform.billingCommerceCenter.nav.overview")}
        items={primaryNav.map((item) => ({
          id: item.id,
          href: item.href,
          label: t(item.labelKey),
        }))}
        groups={BILLING_COMMERCE_NAV_GROUPS.map((group) => ({
          id: group.id,
          label: t(group.labelKey),
          itemIds: group.itemIds,
        }))}
      />
      {children}
    </PlatformPageFrame>
  );
}

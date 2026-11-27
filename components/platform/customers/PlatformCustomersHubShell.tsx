import { Suspense, type ReactNode } from "react";
import { PlatformCustomersHubTabs } from "@/components/platform/customers/PlatformCustomersHubTabs";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PlatformCustomersHubShellProps = {
  children: ReactNode;
};

export async function PlatformCustomersHubShell({
  children,
}: PlatformCustomersHubShellProps) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <PlatformCustomersHubTabs
          ariaLabel={t("platform.customersHub.tabsAria")}
          labels={{
            overview: t("platform.customersHub.tabs.overview"),
            organizations: t("platform.customersHub.tabs.organizations"),
            customerSuccess: t("platform.customersHub.tabs.customerSuccess"),
            supportLink: t("platform.customersHub.supportLink"),
          }}
        />
      </Suspense>
      {children}
    </div>
  );
}

import { BillingAdminPanel } from "@/components/app/settings/BillingAdminPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import {
  buildBillingPresentationMaps,
  buildBillingReferenceLabels,
} from "@/lib/commercial-packages";
import { loadSubscriptionProductReads } from "@/lib/commercial-packages/load-kompis-product-access";
import { buildPortfolioLabels } from "@/lib/commercial-packages/portfolio-labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Authoritative subscription surface — reuses billing admin (no payment mutations). */
export default async function AccountSubscriptionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const productReads = await loadSubscriptionProductReads();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.nav.accountSubscription") },
      ]}
      eyebrow={hubT(t, "account.subscriptionEyebrow")}
      title={t("customerApp.portalStructure.nav.accountSubscription")}
      description={hubT(t, "account.subscriptionDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <BillingAdminPanel
        labels={buildBillingReferenceLabels(t)}
        portfolio={buildPortfolioLabels(t)}
        license={productReads.license}
        access={productReads.access}
        locale={locale}
        presentation={buildBillingPresentationMaps(dict)}
        embedded
      />
    </AppHubShell>
  );
}

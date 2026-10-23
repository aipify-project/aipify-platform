import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { EnterpriseInvoiceDetailsPanel } from "@/components/shared/enterprise-invoicing";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildEnterpriseInvoicingLabels } from "@/lib/enterprise-invoicing";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Account invoicing entry — uses existing enterprise invoicing panel.
 * Does not invent invoice rows; presentation is owned by that panel.
 */
export default async function AccountInvoicesPage() {
  const locale = await getLocale();
  // `enterpriseInvoicing` lives in customer-app/core.json — without `core`,
  // label builder falls back to humanized key fragments (e.g. "NEXT DUE TITLE").
  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "dashboard",
    "core",
  ]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.nav.accountInvoices") },
      ]}
      eyebrow={hubT(t, "account.invoicesEyebrow")}
      title={hubT(t, "account.invoicesTitle")}
      description={hubT(t, "account.invoicesDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <EnterpriseInvoiceDetailsPanel
        backHref={FOUNDATION_NAV_BINDINGS.accountSubscription}
        labels={buildEnterpriseInvoicingLabels(t, "customerApp")}
        locale={locale}
        embedded
      />
    </AppHubShell>
  );
}

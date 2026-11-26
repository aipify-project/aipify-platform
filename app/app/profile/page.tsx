import { AppCustomerProfilePanel } from "@/components/app/account-profile/AppCustomerProfilePanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { buildAccountProfileLabels } from "@/lib/app/account-profile";
import { loadAccountProfileView } from "@/lib/app/account-profile/load";
import { parseAccountProfileTab } from "@/lib/app/account-profile/tabs";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CustomerProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const labels = buildAccountProfileLabels(t);
  const view = await loadAccountProfileView();
  const params = await searchParams;
  const activeTab = parseAccountProfileTab(params.tab);

  if (!view) {
    redirect(`/login?next=${FOUNDATION_NAV_BINDINGS.accountProfile}`);
  }

  return (
    <AppHubShell
      breadcrumbLabel={common.breadcrumb}
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: labels.title },
      ]}
      eyebrow=""
      title={labels.title}
      description={labels.description}
    >
      <AppCustomerProfilePanel view={view} labels={labels} locale={locale} activeTab={activeTab} />
    </AppHubShell>
  );
}

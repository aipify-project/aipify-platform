import { AppIconActionCard } from "@/components/app/design";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { HubArrowIcon } from "@/components/app/hubs/HubArrowIcon";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Shared Account Center overview — owned by the workspace, not each product. */
export default async function AccountCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      title: t("customerApp.portalStructure.nav.accountSubscription"),
      description: hubT(t, "account.subscriptionCard"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountInvoices,
      title: t("customerApp.portalStructure.nav.accountInvoices"),
      description: hubT(t, "account.invoicesCard"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountIntegrations,
      title: t("customerApp.portalStructure.nav.accountIntegrations"),
      description: hubT(t, "account.integrationsCard"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.accountNotifications,
      title: t("customerApp.portalStructure.nav.accountNotifications"),
      description: hubT(t, "account.notificationsCard"),
      tone: "slate" as const,
    },
  ];

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        { label: t("customerApp.portalStructure.navGroups.account") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.account")}
      title={hubT(t, "account.overviewTitle")}
      description={hubT(t, "account.overviewDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      status={
        ctx.planLabel || ctx.licenseStatusLabel
          ? { label: ctx.planLabel || ctx.licenseStatusLabel || common.statusReady, tone: "emerald" }
          : { label: common.statusReady, tone: "slate" }
      }
      primaryAction={{
        label: t("customerApp.portalStructure.nav.accountSubscription"),
        href: FOUNDATION_NAV_BINDINGS.accountSubscription,
      }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <AppIconActionCard
            key={card.href}
            href={card.href}
            title={card.title}
            description={card.description}
            tone={card.tone}
            icon={<HubArrowIcon />}
          />
        ))}
      </div>
    </AppHubShell>
  );
}

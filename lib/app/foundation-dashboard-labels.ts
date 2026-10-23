import type { AppFoundationDashboardLabels } from "@/components/app/foundation/AppFoundationDashboard";
import type { Translator } from "@/lib/i18n/translate";

export function buildFoundationDashboardLabels(t: Translator): AppFoundationDashboardLabels {
  return {
    eyebrow: t("customerApp.portalStructure.foundationDashboard.eyebrow"),
    title: t("customerApp.portalStructure.foundationDashboard.title"),
    description: t("customerApp.portalStructure.foundationDashboard.description"),
    welcomeNamed: t("customerApp.portalStructure.foundationDashboard.welcomeNamed"),
    welcomeGeneric: t("customerApp.portalStructure.foundationDashboard.welcomeGeneric"),
    orgFallback: t("customerApp.portalStructure.foundationDashboard.orgFallback"),
    productsTitle: t("customerApp.portalStructure.foundationDashboard.productsTitle"),
    productsDescription: t("customerApp.portalStructure.foundationDashboard.productsDescription"),
    webTitle: t("customerApp.portalStructure.foundationDashboard.webTitle"),
    webDescription: t("customerApp.portalStructure.foundationDashboard.webDescription"),
    webUnavailable: t("customerApp.portalStructure.foundationDashboard.webUnavailable"),
    bedriftUnavailable: t("customerApp.portalStructure.foundationDashboard.bedriftUnavailable"),
    bedriftTitle: t("customerApp.portalStructure.foundationDashboard.bedriftTitle"),
    bedriftDescription: t("customerApp.portalStructure.foundationDashboard.bedriftDescription"),
    setupTitle: t("customerApp.portalStructure.foundationDashboard.setupTitle"),
    setupDescription: t("customerApp.portalStructure.foundationDashboard.setupDescription"),
    connectionTitle: t("customerApp.portalStructure.foundationDashboard.connectionTitle"),
    connectionDescription: t("customerApp.portalStructure.foundationDashboard.connectionDescription"),
    integrationsTitle: t("customerApp.portalStructure.foundationDashboard.integrationsTitle"),
    integrationsDescription: t(
      "customerApp.portalStructure.foundationDashboard.integrationsDescription"
    ),
    accountTitle: t("customerApp.portalStructure.foundationDashboard.accountTitle"),
    accountDescription: t("customerApp.portalStructure.foundationDashboard.accountDescription"),
    subscriptionTitle: t("customerApp.portalStructure.foundationDashboard.subscriptionTitle"),
    subscriptionDescription: t(
      "customerApp.portalStructure.foundationDashboard.subscriptionDescription"
    ),
    attentionTitle: t("customerApp.portalStructure.foundationDashboard.attentionTitle"),
    attentionDescription: t("customerApp.portalStructure.foundationDashboard.attentionDescription"),
    attentionEmpty: t("customerApp.portalStructure.foundationDashboard.attentionEmpty"),
    openWeb: t("customerApp.portalStructure.foundationDashboard.openWeb"),
    openBedrift: t("customerApp.portalStructure.foundationDashboard.openBedrift"),
    openBilling: t("customerApp.portalStructure.foundationDashboard.openBilling"),
    openNotifications: t("customerApp.portalStructure.foundationDashboard.openNotifications"),
    statusAvailable: t("customerApp.portalStructure.foundationDashboard.statusAvailable"),
    statusUnavailable: t("customerApp.portalStructure.foundationDashboard.statusUnavailable"),
    statusReady: t("customerApp.portalStructure.foundationDashboard.statusReady"),
  };
}

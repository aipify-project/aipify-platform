import type { AppFoundationDashboardLabels } from "@/components/app/foundation/AppFoundationDashboard";
import type { Translator } from "@/lib/i18n/translate";

export function buildFoundationDashboardLabels(t: Translator): AppFoundationDashboardLabels {
  return {
    eyebrow: t("customerApp.portalStructure.foundationDashboard.eyebrow"),
    title: t("customerApp.portalStructure.foundationDashboard.title"),
    description: t("customerApp.portalStructure.foundationDashboard.description"),
    welcomeNamed: t("customerApp.portalStructure.foundationDashboard.welcomeNamed"),
    welcomePersonNamed: t("customerApp.portalStructure.foundationDashboard.welcomePersonNamed"),
    welcomeGeneric: t("customerApp.portalStructure.foundationDashboard.welcomeGeneric"),
    greetingMorning: t("customerApp.portalStructure.foundationDashboard.greetingMorning"),
    greetingAfternoon: t("customerApp.portalStructure.foundationDashboard.greetingAfternoon"),
    greetingEvening: t("customerApp.portalStructure.foundationDashboard.greetingEvening"),
    orgFallback: t("customerApp.portalStructure.foundationDashboard.orgFallback"),
    productsTitle: t("customerApp.portalStructure.foundationDashboard.productsTitle"),
    productsDescription: t("customerApp.portalStructure.foundationDashboard.productsDescription"),
    webTitle: t("customerApp.portalStructure.foundationDashboard.webTitle"),
    webDescription: t("customerApp.portalStructure.foundationDashboard.webDescription"),
    webUnavailable: t("customerApp.portalStructure.foundationDashboard.webUnavailable"),
    webDataUnavailable: t("customerApp.portalStructure.foundationDashboard.webDataUnavailable"),
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
    invoicesTitle: t("customerApp.portalStructure.foundationDashboard.invoicesTitle"),
    invoicesDescription: t("customerApp.portalStructure.foundationDashboard.invoicesDescription"),
    quickActionsTitle: t("customerApp.portalStructure.foundationDashboard.quickActionsTitle"),
    quickActionsDescription: t(
      "customerApp.portalStructure.foundationDashboard.quickActionsDescription"
    ),
    helpTitle: t("customerApp.portalStructure.foundationDashboard.helpTitle"),
    helpDescription: t("customerApp.portalStructure.foundationDashboard.helpDescription"),
    helpOpen: t("customerApp.portalStructure.foundationDashboard.helpOpen"),
    attentionTitle: t("customerApp.portalStructure.foundationDashboard.attentionTitle"),
    attentionDescription: t("customerApp.portalStructure.foundationDashboard.attentionDescription"),
    attentionEmpty: t("customerApp.portalStructure.foundationDashboard.attentionEmpty"),
    attentionConnectionNeedsSetup: t(
      "customerApp.portalStructure.foundationDashboard.attentionConnectionNeedsSetup"
    ),
    attentionConnectionNeedsAction: t(
      "customerApp.portalStructure.foundationDashboard.attentionConnectionNeedsAction"
    ),
    attentionConnectionPending: t(
      "customerApp.portalStructure.foundationDashboard.attentionConnectionPending"
    ),
    openWeb: t("customerApp.portalStructure.foundationDashboard.openWeb"),
    openBedrift: t("customerApp.portalStructure.foundationDashboard.openBedrift"),
    openBilling: t("customerApp.portalStructure.foundationDashboard.openBilling"),
    openInvoices: t("customerApp.portalStructure.foundationDashboard.openInvoices"),
    openSubscription: t("customerApp.portalStructure.foundationDashboard.openSubscription"),
    openNotifications: t("customerApp.portalStructure.foundationDashboard.openNotifications"),
    openExplore: t("customerApp.portalStructure.foundationDashboard.openExplore"),
    openHelp: t("customerApp.portalStructure.foundationDashboard.openHelp"),
    statusAvailable: t("customerApp.portalStructure.foundationDashboard.statusAvailable"),
    statusUnavailable: t("customerApp.portalStructure.foundationDashboard.statusUnavailable"),
    dataUnavailable: t("customerApp.portalStructure.foundationDashboard.dataUnavailable"),
    statusReady: t("customerApp.portalStructure.foundationDashboard.statusReady"),
    exploreTitle: t("customerApp.portalStructure.foundationDashboard.exploreTitle"),
    exploreDescription: t("customerApp.portalStructure.foundationDashboard.exploreDescription"),
  };
}

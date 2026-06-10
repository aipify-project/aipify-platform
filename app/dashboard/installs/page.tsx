import InstallsPanel from "@/components/dashboard/InstallsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InstallsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["install", "branding"]);
  const t = createTranslator(dict);

  return (
    <InstallsPanel
      locale={locale}
      labels={{
        title: t("install.title"),
        subtitle: t("install.subtitle"),
        create: t("install.create"),
        name: t("install.name"),
        siteUrl: t("install.siteUrl"),
        systemType: t("install.systemType"),
        systemTypes: {
          wordpress: t("install.systemTypes.wordpress"),
          shopify: t("install.systemTypes.shopify"),
          custom: t("install.systemTypes.custom"),
          other: t("install.systemTypes.other"),
        },
        empty: t("install.empty"),
        tokenTitle: t("install.tokenTitle"),
        tokenHint: t("install.tokenHint"),
        copy: t("install.copy"),
        copied: t("install.copied"),
        status: {
          draft: t("install.status.draft"),
          pending_verification: t("install.status.pending_verification"),
          ready: t("install.status.ready"),
          installing: t("install.status.installing"),
          active: t("install.status.active"),
          warning: t("install.status.warning"),
          failed: t("install.status.failed"),
          suspended: t("install.status.suspended"),
          archived: t("install.status.archived"),
        },
        verifyEndpoint: t("install.verifyEndpoint"),
        error: t("install.error"),
        loading: t("install.loading"),
        company: t("install.company"),
        installationId: t("install.installationId"),
        modules: t("install.modules"),
        integrations: t("install.integrations"),
        lastSynced: t("install.lastSynced"),
        neverSynced: t("install.neverSynced"),
        modulesList: {
          support_ai: t("install.modulesList.support_ai"),
          analytics_ai: t("install.modulesList.analytics_ai"),
          assistant: t("install.modulesList.assistant"),
          commerce_ai: t("install.modulesList.commerce_ai"),
          notifications: t("install.modulesList.notifications"),
          install_ai: t("install.modulesList.install_ai"),
          moderation_ai: t("install.modulesList.moderation_ai"),
          executive_insights: t("install.modulesList.executive_insights"),
        },
        integrationsList: {
          supabase: t("install.integrationsList.supabase"),
          shopify: t("install.integrationsList.shopify"),
          resend: t("install.integrationsList.resend"),
          wordpress: t("install.integrationsList.wordpress"),
          stripe: t("install.integrationsList.stripe"),
          openai: t("install.integrationsList.openai"),
        },
        integrationStatus: {
          connected: t("install.integrationStatus.connected"),
          pending: t("install.integrationStatus.pending"),
          error: t("install.integrationStatus.error"),
          disconnected: t("install.integrationStatus.disconnected"),
        },
        pulseLabel: t("branding.pulseLabel"),
        connectionSuccess: t("install.connectionSuccess"),
        wizard: {
          title: t("install.wizard.title"),
          subtitle: t("install.wizard.subtitle"),
          start: t("install.wizard.start"),
          next: t("install.wizard.next"),
          back: t("install.wizard.back"),
          finish: t("install.wizard.finish"),
          loading: t("install.wizard.loading"),
          error: t("install.wizard.error"),
          pulseLabel: t("branding.pulseLabel"),
          steps: {
            name: t("install.wizard.steps.name"),
            domain: t("install.wizard.steps.domain"),
            verify: t("install.wizard.steps.verify"),
            modules: t("install.wizard.steps.modules"),
            credentials: t("install.wizard.steps.credentials"),
            activate: t("install.wizard.steps.activate"),
            health: t("install.wizard.steps.health"),
          },
          nameLabel: t("install.wizard.nameLabel"),
          namePlaceholder: t("install.wizard.namePlaceholder"),
          domainLabel: t("install.wizard.domainLabel"),
          domainPlaceholder: t("install.wizard.domainPlaceholder"),
          systemType: t("install.systemType"),
          systemTypes: {
            wordpress: t("install.systemTypes.wordpress"),
            shopify: t("install.systemTypes.shopify"),
            custom: t("install.systemTypes.custom"),
            other: t("install.systemTypes.other"),
          },
          verifyTitle: t("install.wizard.verifyTitle"),
          verifyHint: t("install.wizard.verifyHint"),
          startVerification: t("install.wizard.startVerification"),
          confirmVerification: t("install.wizard.confirmVerification"),
          metaTagLabel: t("install.wizard.metaTagLabel"),
          modulesTitle: t("install.wizard.modulesTitle"),
          modulesHint: t("install.wizard.modulesHint"),
          credentialsTitle: t("install.wizard.credentialsTitle"),
          credentialsHint: t("install.wizard.credentialsHint"),
          copy: t("install.copy"),
          copied: t("install.copied"),
          activateTitle: t("install.wizard.activateTitle"),
          activateHint: t("install.wizard.activateHint"),
          activate: t("install.wizard.activate"),
          healthTitle: t("install.wizard.healthTitle"),
          healthScore: t("install.wizard.healthScore"),
          healthStatus: {
            healthy: t("install.wizard.healthStatus.healthy"),
            needs_attention: t("install.wizard.healthStatus.needs_attention"),
            critical: t("install.wizard.healthStatus.critical"),
          },
          completed: t("install.wizard.completed"),
        },
      }}
    />
  );
}

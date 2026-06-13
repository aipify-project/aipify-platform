import { OrganizationalMemoryCenterPanel } from "@/components/app/organizational-memory-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMemoryCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalMemoryCenter";

  return (
    <OrganizationalMemoryCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        knowledgeCenterLink: t(`${p}.knowledgeCenterLink`),
        orgMemoryEngineLink: t(`${p}.orgMemoryEngineLink`),
        enterpriseMemoryLink: t(`${p}.enterpriseMemoryLink`),
        employeeKnowledgeLink: t(`${p}.employeeKnowledgeLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        recentKnowledgeTitle: t(`${p}.recentKnowledgeTitle`),
        knowledgeItemsTitle: t(`${p}.knowledgeItemsTitle`),
        gapsTitle: t(`${p}.gapsTitle`),
        retentionRisksTitle: t(`${p}.retentionRisksTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        contributionsTitle: t(`${p}.contributionsTitle`),
        validationTitle: t(`${p}.validationTitle`),
        emptySection: t(`${p}.emptySection`),
        category: t(`${p}.category`),
        health: t(`${p}.health`),
        validation: t(`${p}.validation`),
        usage: t(`${p}.usage`),
        owner: t(`${p}.owner`),
        dismiss: t(`${p}.dismiss`),
        approve: t(`${p}.approve`),
        markReviewed: t(`${p}.markReviewed`),
        submitContribution: t(`${p}.submitContribution`),
        contributionTitle: t(`${p}.contributionTitle`),
        contributionContent: t(`${p}.contributionContent`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        categories: {
          operational: t(`${p}.categories.operational`),
          customer: t(`${p}.categories.customer`),
          executive: t(`${p}.categories.executive`),
          technical: t(`${p}.categories.technical`),
          cultural: t(`${p}.categories.cultural`),
        },
        healthLevels: {
          excellent: t(`${p}.healthLevels.excellent`),
          healthy: t(`${p}.healthLevels.healthy`),
          needs_attention: t(`${p}.healthLevels.needs_attention`),
          critical: t(`${p}.healthLevels.critical`),
        },
        validationStatuses: {
          draft: t(`${p}.validationStatuses.draft`),
          review: t(`${p}.validationStatuses.review`),
          approved: t(`${p}.validationStatuses.approved`),
          published: t(`${p}.validationStatuses.published`),
          periodic_review: t(`${p}.validationStatuses.periodic_review`),
        },
        metrics: {
          healthScore: t(`${p}.metrics.healthScore`),
          healthLabel: t(`${p}.metrics.healthLabel`),
          recentAdded: t(`${p}.metrics.recentAdded`),
          gapsOpen: t(`${p}.metrics.gapsOpen`),
          usageTotal: t(`${p}.metrics.usageTotal`),
          criticalRisks: t(`${p}.metrics.criticalRisks`),
          retentionRisks: t(`${p}.metrics.retentionRisks`),
          reuseRate: t(`${p}.metrics.reuseRate`),
        },
      }}
    />
  );
}

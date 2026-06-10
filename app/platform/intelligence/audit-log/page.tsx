import PlatformIntelligenceAuditPanel from "@/components/platform/PlatformIntelligenceAuditPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceAuditLogPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformIntelligenceAuditPanel
      locale={locale}
      labels={{
        title: t("platform.intelligence.auditLog.title"),
        subtitle: t("platform.intelligence.auditLog.subtitle"),
        loading: t("platform.intelligence.auditLog.loading"),
        empty: t("platform.intelligence.auditLog.empty"),
        type: t("platform.intelligence.auditLog.type"),
        action: t("platform.intelligence.auditLog.action"),
        pattern: t("platform.intelligence.auditLog.pattern"),
        reviewer: t("platform.intelligence.auditLog.reviewer"),
        notes: t("platform.intelligence.auditLog.notes"),
        timestamp: t("platform.intelligence.auditLog.timestamp"),
        explanation: t("platform.intelligence.auditLog.explanation"),
        filters: {
          title: t("platform.intelligence.auditLog.filters.title"),
          eventType: t("platform.intelligence.auditLog.filters.eventType"),
          environment: t("platform.intelligence.auditLog.filters.environment"),
          action: t("platform.intelligence.auditLog.filters.action"),
          reviewer: t("platform.intelligence.auditLog.filters.reviewer"),
          riskLevel: t("platform.intelligence.auditLog.filters.riskLevel"),
          dateFrom: t("platform.intelligence.auditLog.filters.dateFrom"),
          dateTo: t("platform.intelligence.auditLog.filters.dateTo"),
          apply: t("platform.intelligence.auditLog.filters.apply"),
          clear: t("platform.intelligence.auditLog.filters.clear"),
          all: t("platform.intelligence.auditLog.filters.all"),
        },
        eventTypes: {
          learning_event: t("platform.intelligence.auditLog.eventTypes.learning_event"),
          pattern_review: t("platform.intelligence.auditLog.eventTypes.pattern_review"),
          self_healing_run: t("platform.intelligence.auditLog.eventTypes.self_healing_run"),
          recommendation: t("platform.intelligence.auditLog.eventTypes.recommendation"),
          approval: t("platform.intelligence.auditLog.eventTypes.approval"),
          rejection: t("platform.intelligence.auditLog.eventTypes.rejection"),
          system_event: t("platform.intelligence.auditLog.eventTypes.system_event"),
        },
        riskLevels: {
          low: t("platform.intelligence.auditLog.riskLevels.low"),
          medium: t("platform.intelligence.auditLog.riskLevels.medium"),
          high: t("platform.intelligence.auditLog.riskLevels.high"),
          critical: t("platform.intelligence.auditLog.riskLevels.critical"),
        },
      }}
    />
  );
}

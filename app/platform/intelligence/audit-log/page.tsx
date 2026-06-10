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
      }}
    />
  );
}

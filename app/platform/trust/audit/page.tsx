import { TrustAuditPanel } from "@/components/platform/trust";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustAuditPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <TrustAuditPanel
      labels={{
        title: t("platform.trustCenter.audit.title"),
        subtitle: t("platform.trustCenter.audit.subtitle"),
        loading: t("platform.trustCenter.loading"),
        foundationTitle: t("platform.trustCenter.audit.foundationTitle"),
        foundationValue: t("platform.trust.statsValue"),
        auditEvents: t("platform.trustCenter.audit.auditEvents"),
        tenantsWithAudits: t("platform.trustCenter.audit.tenantsWithAudits"),
        defaultAccess: t("platform.trustCenter.audit.defaultAccess"),
        actionSummaryTitle: t("platform.trustCenter.audit.actionSummaryTitle"),
        pending: t("platform.trustActions.pending"),
        executed: t("platform.trustActions.executed"),
        rejected: t("platform.trustActions.rejected"),
        emergency: t("platform.trustActions.emergency"),
        recentActivity: t("platform.trustActions.recentActivity"),
        noActivity: t("platform.trustActions.noActivity"),
        immutableNote: t("platform.trustCenter.audit.immutableNote"),
      }}
    />
  );
}

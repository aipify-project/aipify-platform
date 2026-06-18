import { AuditAccountabilityDashboardPanel } from "@/components/app/audit-accountability";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AuditAccountabilityPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "auditAccountability");
  const t = createTranslator(dict);
  const p = "customerApp.auditAccountability";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AuditAccountabilityDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          aipifyCore: t(`${p}.aipifyCore`),
          identityAccess: t(`${p}.identityAccess`),
          secureAiActions: t(`${p}.secureAiActions`),
          accountabilityEngine: t(`${p}.accountabilityEngine`),
          totalEvents: t(`${p}.totalEvents`),
          aiEvents: t(`${p}.aiEvents`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          retention: t(`${p}.retention`),
          export: t(`${p}.export`),
          topCategories: t(`${p}.topCategories`),
          recentActivity: t(`${p}.recentActivity`),
          aiTimeline: t(`${p}.aiTimeline`),
          securityEvents: t(`${p}.securityEvents`),
          failedActions: t(`${p}.failedActions`),
          principles: t(`${p}.principles`),
          noEvents: t(`${p}.noEvents`),
        }}
      />
    </div>
  );
}

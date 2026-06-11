import { SecureAiActionDashboardPanel } from "@/components/app/secure-ai-action";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecureAiActionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.secureAiAction";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SecureAiActionDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          aipifyCore: t(`${p}.aipifyCore`),
          identityAccess: t(`${p}.identityAccess`),
          approvals: t(`${p}.approvals`),
          actionEngine: t(`${p}.actionEngine`),
          principles: t(`${p}.principles`),
          pendingApprovals: t(`${p}.pendingApprovals`),
          executedActions: t(`${p}.executedActions`),
          failedExecutions: t(`${p}.failedExecutions`),
          rejectedActions: t(`${p}.rejectedActions`),
          riskDistribution: t(`${p}.riskDistribution`),
          recentAiActions: t(`${p}.recentAiActions`),
          expectedImpact: t(`${p}.expectedImpact`),
          approve: t(`${p}.approve`),
          reject: t(`${p}.reject`),
          actionCatalog: t(`${p}.actionCatalog`),
          approvalRequired: t(`${p}.approvalRequired`),
          autoAllowed: t(`${p}.autoAllowed`),
        }}
      />
    </div>
  );
}

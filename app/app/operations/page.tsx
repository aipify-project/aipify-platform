import Link from "next/link";
import { AocDashboardPanel } from "@/components/app/aoc";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OperationsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.operationsCenter";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-amber-700">{t(`${p}.philosophy`)}</p>
        <Link
          href="/app/operations/automation-control"
          className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(`${p}.automationControlLink`)} →
        </Link>
        <Link
          href="/app/operations/database-governance"
          className="ml-4 mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(`${p}.databaseGovernanceLink`)} →
        </Link>
        <Link
          href="/app/operations/deployments"
          className="ml-4 mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          {t(`${p}.deploymentsLink`)} →
        </Link>
      </div>
      <AocDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          operationalHealth: t(`${p}.operationalHealth`),
          humanOversight: t(`${p}.humanOversight`),
          generate: t(`${p}.generate`),
          generating: t(`${p}.generating`),
          review: t(`${p}.review`),
          findingsSection: t(`${p}.findingsSection`),
          recommendationsSection: t(`${p}.recommendationsSection`),
          watchersSection: t(`${p}.watchersSection`),
          risk: t(`${p}.risk`),
          confidence: t(`${p}.confidence`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}

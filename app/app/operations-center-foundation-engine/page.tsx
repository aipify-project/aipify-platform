import { OperationsCenterFoundationEngineDashboardPanel } from "@/components/app/operations-center-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OperationsCenterFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.operationsCenterFoundationEngine";

  const labelKeys = [
    "loading",
    "engineTitle",
    "summary",
    "principles",
    "sinceLastTime",
    "supportResolved",
    "kcUpdated",
    "tasksCompleted",
    "bottlenecks",
    "bellMoments",
    "recognitionMoments",
    "moduleOverviews",
    "viewModule",
    "urgentEvents",
    "openEvents",
    "pendingApprovals",
    "urgentActions",
    "openOperationalEvents",
    "noEvents",
    "acknowledge",
    "resolve",
    "working",
    "companionExamples",
    "successCriteria",
    "selfLoveConnection",
    "trustConnection",
  ] as const;

  const labels = Object.fromEntries(labelKeys.map((key) => [key, t(`${p}.${key}`)])) as Record<string, string>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OperationsCenterFoundationEngineDashboardPanel labels={labels} />
    </div>
  );
}

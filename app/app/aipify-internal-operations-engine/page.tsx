import { AipifyInternalOperationsEngineDashboardPanel } from "@/components/app/aipify-internal-operations-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyInternalOperationsEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyInternalOperationsEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyInternalOperationsEngineDashboardPanel labels={{ loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          open_tasks: t(`${p}.open_tasks`),
          open_feedback: t(`${p}.open_feedback`),
          validations_passed: t(`${p}.validations_passed`),
          release_blockers: t(`${p}.release_blockers`),
          tasks: t(`${p}.tasks`),
          quality: t(`${p}.quality`),
          pilot: t(`${p}.pilot`) }} />
    </div>
  );
}

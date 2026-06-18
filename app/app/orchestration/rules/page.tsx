import Link from "next/link";
import { OrchestrationRulesPanel } from "@/components/app/orchestration";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrchestrationRulesPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "orchestration");
  const t = createTranslator(dict);
  const p = "customerApp.orchestration";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/orchestration" className="text-sm text-indigo-600 hover:underline">{t(`${p}.back`)}</Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.rulesTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.rulesSubtitle`)}</p>
      </div>
      <OrchestrationRulesPanel
        labels={{
          loading: t(`${p}.loading`),
          noRules: t(`${p}.noRules`),
          rulesHint: t(`${p}.rulesHint`),
          global: t(`${p}.global`),
          enabled: t(`${p}.enabledLabel`),
          disabled: t(`${p}.disabledLabel`),
          enable: t(`${p}.enable`),
          disable: t(`${p}.disable`),
        }}
      />
    </div>
  );
}

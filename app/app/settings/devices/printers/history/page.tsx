import Link from "next/link";
import { DevicesIntegrationsSubnav } from "@/components/app/settings/devices/DevicesIntegrationsSubnav";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PrintJobHistoryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard", "navigation"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <DevicesIntegrationsSubnav
        active="printers"
        labels={{
          hub: t("customerApp.printOutput.devicesHub"),
          printers: t("customerApp.printOutput.printersNav"),
          settings: t("customerApp.nav.settings"),
        }}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("customerApp.printOutput.historyTitle")}
        </h1>
        <p className="mt-2 text-gray-600">{t("customerApp.printOutput.historySubtitle")}</p>
      </div>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm text-gray-600">
        <p>{t("customerApp.printOutput.historyNote")}</p>
        <Link href="/app/settings/devices/printers" className="mt-4 inline-block text-indigo-600 hover:underline">
          {t("customerApp.printOutput.backToPrinters")}
        </Link>
      </section>
    </div>
  );
}

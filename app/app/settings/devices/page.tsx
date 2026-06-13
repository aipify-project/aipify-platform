import Link from "next/link";
import { DevicesIntegrationsSubnav } from "@/components/app/settings/devices/DevicesIntegrationsSubnav";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DevicesIntegrationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <DevicesIntegrationsSubnav
        active="hub"
        labels={{
          hub: t("customerApp.printOutput.devicesHub"),
          printers: t("customerApp.printOutput.printersNav"),
          settings: t("customerApp.nav.settings"),
        }}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("customerApp.printOutput.devicesTitle")}</h1>
        <p className="mt-2 text-gray-600">{t("customerApp.printOutput.devicesSubtitle")}</p>
      </div>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Link href="/app/settings/devices/printers" className="block text-indigo-600 hover:underline">
          {t("customerApp.printOutput.printersNav")} →
        </Link>
        <p className="mt-2 text-sm text-gray-500">{t("customerApp.printOutput.devicesPrintersHint")}</p>
      </section>
    </div>
  );
}

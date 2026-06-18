import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import Link from "next/link";

export default async function GrowthPartnerCoreValuesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["growthPartners"]);
  const t = createTranslator(dict);
  const p = "customerApp.growthPartnerCoreValues";

  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    title: t(`${p}.values.${n}.title`),
    body: t(`${p}.values.${n}.body`),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t(`${p}.title`)}</h2>
        <p className="mt-2 text-sm text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <article key={value.title} className="rounded-xl border border-violet-100 bg-violet-50/30 p-5">
            <h3 className="font-semibold text-violet-950">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">{value.body}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-zinc-500">
        <Link href="/growth-partner-terms" className="font-medium text-violet-700 hover:underline">
          {t(`${p}.termsLink`)}
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerSecuritySettingsPage() {
  const dict = await getDictionary(await getLocale(), ["partnerPortal"]);
  const t = createTranslator(dict);
  const p = "partnerPortal";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{t(`${p}.securityTitle`)}</h2>
        <p className="mt-1 text-sm text-slate-600">{t(`${p}.securitySubtitle`)}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-700">{t(`${p}.twoFactorRequired`)}</p>
        <Link
          href="/app/settings/two-factor"
          className="mt-4 inline-block rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800"
        >
          {t(`${p}.manageTwoFactor`)}
        </Link>
      </div>
    </div>
  );
}

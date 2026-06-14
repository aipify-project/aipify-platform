import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { resolveAppHref } from "@/lib/app/route-aliases";

export default async function SecuritySettingsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.securityHub";

  const items = [
    {
      href: resolveAppHref("/app/settings/two-factor"),
      title: t(`${p}.items.signInVerification.title`),
      description: t(`${p}.items.signInVerification.description`),
      status: t(`${p}.items.signInVerification.status`),
    },
    {
      href: resolveAppHref("/app/settings/security"),
      title: t(`${p}.items.sessionManagement.title`),
      description: t(`${p}.items.sessionManagement.description`),
      status: t(`${p}.comingSoon`),
    },
    {
      href: resolveAppHref("/app/settings/security"),
      title: t(`${p}.items.deviceHistory.title`),
      description: t(`${p}.items.deviceHistory.description`),
      status: t(`${p}.comingSoon`),
    },
    {
      href: resolveAppHref("/app/settings/two-factor"),
      title: t(`${p}.items.recoveryMethods.title`),
      description: t(`${p}.items.recoveryMethods.description`),
      status: t(`${p}.items.recoveryMethods.status`),
    },
    {
      href: resolveAppHref("/app/settings/security"),
      title: t(`${p}.items.passkeys.title`),
      description: t(`${p}.items.passkeys.description`),
      status: t(`${p}.planned`),
    },
    {
      href: resolveAppHref("/app/security"),
      title: t(`${p}.items.loginActivity.title`),
      description: t(`${p}.items.loginActivity.description`),
      status: t(`${p}.items.loginActivity.status`),
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 max-w-2xl text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 group-hover:text-violet-700">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                {item.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

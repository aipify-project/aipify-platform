import { AccountPreferencesPanel } from "@/components/app/account/AccountPreferencesPanel";
import { coerceToAppLocale } from "@/lib/i18n/app-locales";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AccountPreferencesPage() {
  const locale = coerceToAppLocale(await getLocale());
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"])),
    ...(await getDictionary(locale, ["shell"])),
  };
  const t = createTranslator(dict, { locale });
  const page = "customerApp.portalStructure.pages.preferences";
  const language = "shell.languageSelector";
  const account = "customerApp.settings.accountPreferences";

  return (
    <AccountPreferencesPanel
      currentLocale={locale}
      languageLabels={{
        label: t(`${language}.label`),
        activeLanguage: t(`${language}.activeLanguage`),
        changeLanguage: t(`${language}.changeLanguage`),
        switchFailed: t(`${language}.switchFailed`),
        retry: t(`${language}.retry`),
        openMenu: t(`${language}.openMenu`),
      }}
      labels={{
        title: t(`${page}.title`),
        subtitle: t(`${page}.subtitle`),
        languageSection: t(`${account}.languageSection`),
        languageHint: t(`${account}.languageHint`),
        timezoneSection: t(`${account}.timezoneSection`),
        timezoneHint: t(`${account}.timezoneHint`),
        notificationsLink: t(`${account}.notificationsLink`),
        notificationsHint: t(`${account}.notificationsSection`),
        back: t(`${account}.back`),
      }}
    />
  );
}

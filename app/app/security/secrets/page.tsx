import { SecuritySecretsPanel } from "@/components/app/security-compliance";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecuritySecretsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "securityCompliance");
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <SecuritySecretsPanel
      labels={{
        title: t(`${p}.secretsTitle`),
        subtitle: t(`${p}.secretsSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        noSecrets: t(`${p}.noSecrets`),
        noRawSecrets: t(`${p}.noRawSecrets`),
        rotate: t(`${p}.rotate`),
        revoke: t(`${p}.revoke`),
      }}
    />
  );
}

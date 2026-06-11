import { SecuritySecretsPanel } from "@/components/app/security-compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecuritySecretsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
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

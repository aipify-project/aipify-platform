import { SecurityPoliciesPanel } from "@/components/app/security-compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecurityPoliciesPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <SecurityPoliciesPanel
      labels={{
        title: t(`${p}.policiesTitle`),
        subtitle: t(`${p}.policiesSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        testPolicy: t(`${p}.testPolicy`),
        requiresApproval: t(`${p}.requiresApproval`),
      }}
    />
  );
}

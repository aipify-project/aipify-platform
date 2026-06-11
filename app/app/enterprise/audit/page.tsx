import { EnterpriseAuditPanel } from "@/components/app/enterprise";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseAuditPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeployment";

  return (
    <EnterpriseAuditPanel
      labels={{
        title: t(`${p}.auditTitle`),
        subtitle: t(`${p}.auditSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        request: t(`${p}.requestExport`),
        noExports: t(`${p}.noExports`),
      }}
    />
  );
}

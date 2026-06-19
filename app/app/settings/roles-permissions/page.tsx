import { RolePermissionMatrixPanel } from "@/components/app/role-permission-matrix";
import { buildRolePermissionMatrixLabels } from "@/lib/role-permission-matrix/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RolePermissionMatrixPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildRolePermissionMatrixLabels(t);

  return <RolePermissionMatrixPanel labels={labels} />;
}

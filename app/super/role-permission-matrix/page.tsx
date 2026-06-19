import { SuperAdminRolePermissionMatrixPanel } from "@/components/super-admin/role-permission-matrix/SuperAdminRolePermissionMatrixPanel";
import { buildSuperAdminRolePermissionMatrixLabels } from "@/lib/role-permission-matrix/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminRolePermissionMatrixPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);
  const labels = buildSuperAdminRolePermissionMatrixLabels(t);

  return <SuperAdminRolePermissionMatrixPanel labels={labels} />;
}

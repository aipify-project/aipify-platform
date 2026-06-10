import DashboardAuthGuard from "@/components/dashboard/DashboardAuthGuard";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common"]);
  const t = createTranslator(dict);

  return (
    <DashboardAuthGuard loadingLabel={t("common.loading")}>
      <DashboardProfileProvider>{children}</DashboardProfileProvider>
    </DashboardAuthGuard>
  );
}

import { SalesEmailTemplateAdmin } from "@/components/platform/sellers/SalesEmailTemplateAdmin";
import { getLocale } from "@/lib/i18n/get-locale";

export const dynamic = "force-dynamic";

export default async function PlatformSalesEmailTemplatesPage() {
  const locale = await getLocale();
  return <SalesEmailTemplateAdmin locale={locale} />;
}

import { CertifiedSalesPartnerEmailDesk } from "@/components/partners-portal/CertifiedSalesPartnerEmailDesk";
import { getLocale } from "@/lib/i18n/get-locale";

export const dynamic = "force-dynamic";

export default async function PartnersEmailTemplatesPage() {
  const locale = await getLocale();
  return <CertifiedSalesPartnerEmailDesk locale={locale} />;
}

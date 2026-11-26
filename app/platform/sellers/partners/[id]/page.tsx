import Link from "next/link";
import { notFound } from "next/navigation";
import { CertifiedSellerProfile } from "@/components/platform/sellers/CertifiedSellerProfile";
import { isCspPartnerId } from "@/lib/certified-sales-partner/partner-admin-detail";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildSellersActionLabels, buildSellersPartnerDrawerLabels } from "@/lib/partners-portal/csp-workspace-labels";

/**
 * Canonical full-page Certified Seller profile (Platform Admin).
 * Same `CertifiedSellerProfile` component as the partners / top 5 / search drawer.
 * Feature owner: PLATFORM ADMIN.
 */
export default async function PlatformSellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isCspPartnerId(id)) notFound();

  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildSellersPartnerDrawerLabels(t);

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 px-6 py-6 lg:px-8">
      <h1 className="sr-only">{labels.profile.title}</h1>
      <Link
        href="/platform/sellers/partners"
        className="inline-flex text-sm font-semibold text-[color:var(--aipify-companion-purple)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]"
      >
        ← {labels.profile.backToPartners}
      </Link>
      <CertifiedSellerProfile
        partnerId={id}
        locale={locale}
        labels={labels}
        actionLabels={buildSellersActionLabels(t)}
        variant="page"
      />
    </div>
  );
}

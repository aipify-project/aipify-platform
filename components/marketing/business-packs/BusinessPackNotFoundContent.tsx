import Link from "next/link";
import { PublicPageHero } from "@/components/marketing/public";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import type { BusinessPackDetailSharedLabels } from "@/lib/marketing/business-packs/parse-detail-page";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

type BusinessPackNotFoundContentProps = {
  labels: BusinessPackDetailSharedLabels;
};

export default function BusinessPackNotFoundContent({ labels }: BusinessPackNotFoundContentProps) {
  const { notFound, breadcrumbs } = labels;

  return (
    <>
      <PublicPageHero
        title={notFound.title}
        subtitle={notFound.subtitle}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.businessPacks, href: "/pricing#business-packs" },
        ]}
        compact
      />
      <div className="mx-auto max-w-xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/pricing#business-packs"
            className={AipifyMarketingClasses.primaryCta}
            {...marketingDataAttr("cta_click", "business_pack_not_found_packs")}
          >
            {notFound.backToPacks}
          </Link>
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
            className={AipifyMarketingClasses.secondaryCta}
            {...marketingDataAttr("cta_click", "business_pack_not_found_demo")}
          >
            {notFound.bookDemo}
          </Link>
          <Link
            href="/contact"
            className={AipifyMarketingClasses.secondaryCta}
            {...marketingDataAttr("cta_click", "business_pack_not_found_contact")}
          >
            {notFound.contact}
          </Link>
        </div>
      </div>
    </>
  );
}

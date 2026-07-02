import type { Metadata } from "next";
import GrowthPartnersPageContent from "@/components/marketing/GrowthPartnersPageContent";
import type { GrowthPartnersPageLabels } from "@/components/marketing/growth-partners/types";
import PublicBreadcrumbs from "@/components/marketing/public/PublicBreadcrumbs";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const redesign = getSection<{ meta?: { title?: string; description?: string } }>(
    marketing,
    "growthPartnersPageRedesign",
  );
  const legacy = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "growthPartners");
  const meta = redesign.meta ?? legacy.meta;
  return {
    title: meta?.title,
    description: meta?.description,
  };
}

export default async function GrowthPartnersPage() {
  const { marketing, t } = await getMarketingContext();
  const section = getSection<
    GrowthPartnersPageLabels & { breadcrumbs?: { home?: string; current?: string } }
  >(marketing, "growthPartnersPageRedesign");
  const breadcrumbs = section.breadcrumbs;

  return (
    <div className="min-w-0">
      {breadcrumbs?.home && breadcrumbs?.current ? (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
          <PublicBreadcrumbs
            items={[
              { label: breadcrumbs.home, href: "/" },
              { label: breadcrumbs.current },
            ]}
          />
        </div>
      ) : null}
      <GrowthPartnersPageContent
        labels={section}
        verificationLabels={buildHumanVerificationLabels(t)}
      />
    </div>
  );
}

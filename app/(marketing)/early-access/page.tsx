import type { Metadata } from "next";
import { EarlyAccessForm, MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ earlyAccessTitle?: string; earlyAccessDescription?: string }>(marketing, "meta");
  return { title: meta.earlyAccessTitle, description: meta.earlyAccessDescription };
}

export default async function EarlyAccessPage() {
  const { marketing } = await getMarketingContext();
  const earlyAccess = getSection<Record<string, unknown>>(marketing, "earlyAccess");

  return (
    <>
      <MarketingPageHeader
        title={(earlyAccess.title as string) ?? ""}
        subtitle={earlyAccess.subtitle as string}
      />
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <EarlyAccessForm labels={earlyAccess as Parameters<typeof EarlyAccessForm>[0]["labels"]} />
      </div>
    </>
  );
}

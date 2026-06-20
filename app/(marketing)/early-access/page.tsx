import type { Metadata } from "next";
import { EarlyAccessForm, MarketingDifferentiationStrip, MarketingPageHeader, MarketingTrustSignalStrip } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseStringList } from "@/lib/marketing/parse-marketing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ earlyAccessTitle?: string; earlyAccessDescription?: string }>(marketing, "meta");
  return { title: meta.earlyAccessTitle, description: meta.earlyAccessDescription };
}

export default async function EarlyAccessPage() {
  const { marketing, locale } = await getMarketingContext();
  const earlyAccess = getSection<Record<string, unknown>>(marketing, "earlyAccess");
  const trustSignals = parseStringList(marketing, "trustSignalStrip", "signals");
  const dict = await getDictionary(locale, ["common"]);
  const t = createTranslator(dict);

  return (
    <>
      <MarketingPageHeader
        title={(earlyAccess.title as string) ?? ""}
        subtitle={earlyAccess.subtitle as string}
      />
      <MarketingTrustSignalStrip signals={trustSignals} />
      <MarketingDifferentiationStrip themes={parseStringList(marketing, "differentiationStrip", "themes")} />
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <EarlyAccessForm
          labels={earlyAccess as Parameters<typeof EarlyAccessForm>[0]["labels"]}
          verificationLabels={buildHumanVerificationLabels(t)}
          variant="light"
        />
      </div>
    </>
  );
}

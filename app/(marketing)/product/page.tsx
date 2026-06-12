import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { MarketingCtaBand, MarketingPageHeader } from "@/components/marketing";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection, parseDemoSteps } from "@/lib/marketing/parse-marketing";

const AnimatedProductDemo = dynamic(
  () => import("@/components/marketing/AnimatedProductDemo"),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-white/5" /> }
);

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ productTitle?: string; productDescription?: string }>(marketing, "meta");
  return { title: meta.productTitle, description: meta.productDescription };
}

export default async function ProductPage() {
  const { marketing } = await getMarketingContext();
  const productPage = getSection<Record<string, string>>(marketing, "productPage");
  const animatedDemo = getSection<Record<string, string>>(marketing, "animatedDemo");
  const ctaBand = getSection<Record<string, string>>(marketing, "ctaBand");

  return (
    <>
      <MarketingPageHeader title={productPage.title ?? ""} subtitle={productPage.subtitle} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatedProductDemo
          title={animatedDemo.title ?? ""}
          subtitle={animatedDemo.subtitle ?? ""}
          steps={parseDemoSteps(marketing)}
          mobileSummary={animatedDemo.mobileSummary ?? ""}
        />
      </div>
      <MarketingCtaBand title={ctaBand.title ?? ""} subtitle={ctaBand.subtitle ?? ""} button={ctaBand.button ?? ""} />
    </>
  );
}

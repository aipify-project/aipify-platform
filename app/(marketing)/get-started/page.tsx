import type { Metadata } from "next";
import GetStartedPageContent from "@/components/marketing/GetStartedPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseGetStartedPageLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const labels = parseGetStartedPageLabels(marketing);
  return { title: labels.meta.title, description: labels.meta.description };
}

export default async function GetStartedPage() {
  const { marketing } = await getMarketingContext();
  const labels = parseGetStartedPageLabels(marketing);

  return (
    <GetStartedPageContent
      labels={labels}
      differentiationThemes={parseStringList(marketing, "differentiationStrip", "themes")}
    />
  );
}

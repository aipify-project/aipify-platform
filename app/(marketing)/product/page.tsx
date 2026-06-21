import type { Metadata } from "next";
import ProductPageContent from "@/components/marketing/product/ProductPageContent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { parseProductPageContent } from "@/lib/marketing/parse-product-page";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const content = parseProductPageContent(marketing);
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: "/product" },
  };
}

export default async function ProductPage() {
  const { marketing, common } = await getMarketingContext();
  const content = parseProductPageContent(marketing);

  return <ProductPageContent content={content} appName={common.appName} />;
}

import type { Metadata } from "next";
import BookDemoPageContent from "@/components/marketing/BookDemoPageContent";
import type { BookDemoPageLabels } from "@/components/marketing/BookDemoPageContent";
import { parseBookDemoAdvisor } from "@/lib/book-demo-discovery-center";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const demo = getSection<{ meta?: { title?: string; description?: string } }>(marketing, "bookDemoPage");
  return {
    title: demo.meta?.title,
    description: demo.meta?.description,
  };
}

export default async function BookDemoPage() {
  const { marketing, t } = await getMarketingContext();
  const labels = getSection<BookDemoPageLabels>(marketing, "bookDemoPage");

  let advisor = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_book_demo_discovery_center");
    const record = data as Record<string, unknown> | null;
    if (record?.advisor) advisor = parseBookDemoAdvisor(record.advisor);
  } catch {
    advisor = null;
  }

  return (
    <BookDemoPageContent
      labels={labels}
      advisor={advisor}
      verificationLabels={buildHumanVerificationLabels(t)}
    />
  );
}

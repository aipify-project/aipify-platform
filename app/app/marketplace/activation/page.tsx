import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Legacy route — canonical marketplace home is /app/marketplace/business-packs (Foundation 08). */
export default async function MarketplaceSelfServiceActivationPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  const qs = params.toString();
  redirect(qs ? `/app/marketplace/business-packs?${qs}` : "/app/marketplace/business-packs");
}

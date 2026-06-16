import { redirect } from "next/navigation";
import { getPartnersLegacyRedirect } from "@/lib/partners-portal/nav-config";

type PageProps = { params: Promise<{ slug?: string[] }> };

export default async function GrowthLegacyRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug?.length ? `/growth/${slug.join("/")}` : "/growth";
  redirect(getPartnersLegacyRedirect(path) ?? path.replace(/^\/growth/, "/partners"));
}

import { redirect } from "next/navigation";
import { APP_ROUTE_ALIASES } from "@/lib/app/route-aliases";

type AppPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function AppRedirectPage({ params }: AppPageProps) {
  const { slug } = await params;
  const canonical = slug?.length ? `/app/${slug.join("/")}` : "/app";
  const target = APP_ROUTE_ALIASES[canonical] ?? "/dashboard";
  redirect(target);
}

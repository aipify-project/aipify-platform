import { redirect } from "next/navigation";
import { APP_ROUTE_ALIASES } from "@/lib/app/route-aliases";

type AppPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function AppCatchAllPage({ params }: AppPageProps) {
  const { slug } = await params;

  if (!slug?.length) redirect("/app");

  const canonical = `/app/${slug.join("/")}`;
  const target = APP_ROUTE_ALIASES[canonical];
  if (target) redirect(target);
  redirect("/app");
}

import { redirect } from "next/navigation";

export default function PlatformStatsRedirectPage() {
  redirect("/platform/metrics");
}

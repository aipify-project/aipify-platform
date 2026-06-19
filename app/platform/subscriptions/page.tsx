import { redirect } from "next/navigation";

export default function PlatformSubscriptionsRedirectPage() {
  redirect("/platform/billing/subscriptions");
}

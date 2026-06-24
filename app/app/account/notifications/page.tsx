import { redirect } from "next/navigation";

export default function LegacyAccountNotificationsPage() {
  redirect("/app/account/notification-settings");
}

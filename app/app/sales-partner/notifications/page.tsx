import { redirect } from "next/navigation";
import { SHARED_APP_NOTIFICATIONS_PATH } from "@/lib/sales-partner-app-migration/messaging-performance";

/**
 * Varsler is a shared APP surface — not the CSP inbox.
 * Partner admin↔seller threads live under /app/sales-partner/messages only.
 */
export default function SalesPartnerNotificationsRedirectPage() {
  redirect(SHARED_APP_NOTIFICATIONS_PATH);
}

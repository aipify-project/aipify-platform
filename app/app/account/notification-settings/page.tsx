import { redirect } from "next/navigation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/** Legacy path — Account Center notifications is canonical. */
export default function LegacyNotificationSettingsRedirect() {
  redirect(FOUNDATION_NAV_BINDINGS.accountNotifications);
}

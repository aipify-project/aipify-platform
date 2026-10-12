import { redirect } from "next/navigation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/**
 * Legacy domains entry — canonical connection/license hub owns presentation.
 * Bookmark-compatible redirect (no loop; product context preserved via path).
 */
export default function DomainsPage() {
  redirect(FOUNDATION_NAV_BINDINGS.kompisWebConnection);
}

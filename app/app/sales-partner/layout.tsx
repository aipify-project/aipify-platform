import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { CspPortalSessionProvider } from "@/components/partners-portal/CspPortalSessionProvider";
import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { resolvePartnersPortalServerAccess } from "@/lib/partners-portal/server-access";

/**
 * Phase B — APP thin-host gate for Sales Partner (CSP).
 * Reuses partner_identity server gate; does not retire /partners.
 * Feature owner: CUSTOMER APP (module host) + CSP Core APIs.
 */
export default async function SalesPartnerAppLayout({ children }: { children: ReactNode }) {
  const access = await resolvePartnersPortalServerAccess();
  if (access.kind === "unauthorized") {
    redirect("/login?next=/app/sales-partner");
  }
  if (access.kind === "denied") {
    return <AipifySystemNotice status="csp_partner_required" />;
  }

  return (
    <div className={`${AppLayoutClasses.pageWidth} ${AppLayoutClasses.sectionGap}`}>
      <CspPortalSessionProvider>{children}</CspPortalSessionProvider>
    </div>
  );
}

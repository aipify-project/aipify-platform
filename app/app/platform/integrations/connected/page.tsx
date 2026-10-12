import { redirect } from "next/navigation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/** Legacy connected integrations path — Account Center is canonical. */
export default function LegacyConnectedIntegrationsRedirect() {
  redirect(FOUNDATION_NAV_BINDINGS.accountIntegrations);
}

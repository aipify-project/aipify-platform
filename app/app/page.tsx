import { ExecutiveCommandCenterSectionPage } from "@/lib/executive-command-center-engine/section-page";

/** Canonical APP home — render Command Center directly (avoid RSC redirect failures on /app). */
export default function AppPortalHomePage() {
  return <ExecutiveCommandCenterSectionPage activeSection="overview" />;
}

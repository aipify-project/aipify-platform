import { ExecutiveCommandCenterSectionPage } from "@/lib/executive-command-center-engine/section-page";
import type { Ecc590Section } from "@/lib/executive-command-center-engine/config";

function tabToSection(tab: string | undefined): Ecc590Section {
  if (!tab) return "overview";
  const map: Record<string, Ecc590Section> = {
    "since-last-login": "sinceLastLogin",
    sinceLastLogin: "sinceLastLogin",
    alerts: "alerts",
    approvals: "approvals",
    risks: "risks",
    opportunities: "opportunities",
    performance: "performance",
    "companion-briefing": "companionBriefing",
    companionBriefing: "companionBriefing",
    overview: "overview",
  };
  return map[tab] ?? "overview";
}

export default async function ExecutiveCommandCenterOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeSection = tabToSection(tab);
  return <ExecutiveCommandCenterSectionPage activeSection={activeSection} />;
}

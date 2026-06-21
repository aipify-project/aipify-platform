export const ECC590_SECTIONS = [
  { key: "overview", href: "/app/command-center" },
  { key: "sinceLastLogin", href: "/app/command-center/since-last-login" },
  { key: "alerts", href: "/app/command-center/alerts" },
  { key: "approvals", href: "/app/command-center/approvals" },
  { key: "risks", href: "/app/command-center/risks" },
  { key: "opportunities", href: "/app/command-center/opportunities" },
  { key: "performance", href: "/app/command-center/performance" },
  { key: "companionBriefing", href: "/app/command-center/companion-briefing" },
] as const;

export type Ecc590Section = (typeof ECC590_SECTIONS)[number]["key"];

export const ECC590_PRIORITIES = ["information", "attention", "urgent", "critical"] as const;

export function getEcc590ActiveSection(pathname: string, tabQuery?: string | null): Ecc590Section {
  if (tabQuery) {
    const tabMap: Record<string, Ecc590Section> = {
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
    const fromTab = tabMap[tabQuery];
    if (fromTab) return fromTab;
  }

  if (pathname === "/app/command-center" || pathname === "/app/command-center/") return "overview";
  const match = ECC590_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function ecc590SectionToRpc(section: Ecc590Section): string {
  return section === "overview" ? "overview" : "full";
}

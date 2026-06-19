export const SIBO589_SECTIONS = [
  { key: "overview", href: "/app/strategy" },
  { key: "objectives", href: "/app/strategy/objectives" },
  { key: "initiatives", href: "/app/strategy/initiatives" },
  { key: "risks", href: "/app/strategy/risks" },
  { key: "opportunities", href: "/app/strategy/opportunities" },
  { key: "board", href: "/app/strategy/board" },
  { key: "forecasts", href: "/app/strategy/forecasts" },
  { key: "reports", href: "/app/strategy/reports" },
] as const;

export type Sibo589Section = (typeof SIBO589_SECTIONS)[number]["key"];

export const SIBO589_RISK_STATUSES = ["managed", "monitor", "strategic_risk"] as const;

export function getSibo589ActiveSection(pathname: string): Sibo589Section {
  if (pathname === "/app/strategy" || pathname === "/app/strategy/") return "overview";
  const match = SIBO589_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

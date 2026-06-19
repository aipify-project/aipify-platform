export const BP602_SECTIONS = [
  { key: "overview", href: "/platform/developers" },
  { key: "projects", href: "/platform/developers/projects" },
  { key: "sdk", href: "/platform/developers/sdk" },
  { key: "api", href: "/platform/developers/api" },
  { key: "testing", href: "/platform/developers/testing" },
  { key: "publishing", href: "/platform/developers/publishing" },
  { key: "marketplace", href: "/platform/developers/marketplace" },
  { key: "reports", href: "/platform/developers/reports" },
] as const;

export type Bp602Section = (typeof BP602_SECTIONS)[number]["key"];

export function getBp602ActiveSection(pathname: string): Bp602Section {
  if (pathname === "/platform/developers" || pathname === "/platform/developers/") return "overview";
  const match = BP602_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function bp602SectionToRpc(section: Bp602Section): string {
  return section;
}

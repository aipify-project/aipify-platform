export const CMRI594_SECTIONS = [
  { key: "overview", href: "/app/memory" },
  { key: "personalMemory", href: "/app/memory/personal" },
  { key: "organizationMemory", href: "/app/memory/organization" },
  { key: "preferences", href: "/app/memory/preferences" },
  { key: "relationships", href: "/app/memory/relationships" },
  { key: "permissions", href: "/app/memory/permissions" },
  { key: "reviews", href: "/app/memory/reviews" },
  { key: "reports", href: "/app/memory/reports" },
] as const;

export type Cmri594Section = (typeof CMRI594_SECTIONS)[number]["key"];

export function getCmri594ActiveSection(pathname: string): Cmri594Section {
  if (pathname === "/app/memory" || pathname === "/app/memory/") return "overview";
  const match = CMRI594_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function cmri594SectionToRpc(section: Cmri594Section): string {
  return section === "overview" ? "overview" : "full";
}

export const CMRI594_MEMORY_CLASSES = [
  "personal",
  "organizational",
  "operational",
  "companion",
  "knowledge",
  "temporary",
  "permanent",
] as const;

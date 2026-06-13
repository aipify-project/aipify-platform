import type { PlatformRole } from "@/lib/tenant/types";

export type TrustNavId =
  | "overview"
  | "domains"
  | "security"
  | "privacy"
  | "actions"
  | "audit";

export type TrustNavItem = {
  id: TrustNavId;
  href: string;
  labelKey: string;
};

export const TRUST_NAV: TrustNavItem[] = [
  { id: "overview", href: "/platform/trust", labelKey: "platform.trustCenter.nav.overview" },
  {
    id: "domains",
    href: "/platform/trust#domains",
    labelKey: "platform.trustCenter.nav.domains",
  },
  { id: "security", href: "/platform/trust/security", labelKey: "platform.trustCenter.nav.security" },
  { id: "privacy", href: "/platform/trust/privacy", labelKey: "platform.trustCenter.nav.privacy" },
  { id: "actions", href: "/platform/trust/actions", labelKey: "platform.trustCenter.nav.actions" },
  { id: "audit", href: "/platform/trust/audit", labelKey: "platform.trustCenter.nav.audit" },
];

export type TrustDomainIconId =
  | "shield-user"
  | "scale"
  | "book"
  | "target"
  | "heart"
  | "users"
  | "check-circle"
  | "briefcase"
  | "shield-check"
  | "lock"
  | "alert-triangle"
  | "fingerprint";

export type TrustDomainAudience =
  | "executive"
  | "security"
  | "knowledge"
  | "hr"
  | "commercial";

export type TrustDomainId =
  | "identity"
  | "decisions"
  | "knowledge"
  | "goals"
  | "life"
  | "relationships"
  | "actions"
  | "commercial"
  | "security"
  | "privacy";

export type TrustDomain = {
  id: TrustDomainId;
  href: string;
  icon: TrustDomainIconId;
  titleKey: string;
  descriptionKey: string;
  statLabelKey: string;
  audiences: TrustDomainAudience[];
  platformRoles: PlatformRole[];
};

export const TRUST_DOMAINS: TrustDomain[] = [
  {
    id: "identity",
    href: "/platform/trust/identity",
    icon: "shield-user",
    titleKey: "platform.trustCenter.domains.identity.title",
    descriptionKey: "platform.trustCenter.domains.identity.description",
    statLabelKey: "platform.trustCenter.domains.identity.stat",
    audiences: ["executive", "security"],
    platformRoles: ["super_admin", "platform_support"],
  },
  {
    id: "decisions",
    href: "/platform/trust/decisions",
    icon: "scale",
    titleKey: "platform.trustCenter.domains.decisions.title",
    descriptionKey: "platform.trustCenter.domains.decisions.description",
    statLabelKey: "platform.trustCenter.domains.decisions.stat",
    audiences: ["executive"],
    platformRoles: ["super_admin", "platform_support"],
  },
  {
    id: "knowledge",
    href: "/platform/trust/knowledge",
    icon: "book",
    titleKey: "platform.trustCenter.domains.knowledge.title",
    descriptionKey: "platform.trustCenter.domains.knowledge.description",
    statLabelKey: "platform.trustCenter.domains.knowledge.stat",
    audiences: ["knowledge"],
    platformRoles: ["super_admin", "platform_support"],
  },
  {
    id: "goals",
    href: "/platform/trust/goals",
    icon: "target",
    titleKey: "platform.trustCenter.domains.goals.title",
    descriptionKey: "platform.trustCenter.domains.goals.description",
    statLabelKey: "platform.trustCenter.domains.goals.stat",
    audiences: ["hr", "executive"],
    platformRoles: ["super_admin"],
  },
  {
    id: "life",
    href: "/platform/trust/life",
    icon: "heart",
    titleKey: "platform.trustCenter.domains.life.title",
    descriptionKey: "platform.trustCenter.domains.life.description",
    statLabelKey: "platform.trustCenter.domains.life.stat",
    audiences: ["hr"],
    platformRoles: ["super_admin"],
  },
  {
    id: "relationships",
    href: "/platform/trust/relationships",
    icon: "users",
    titleKey: "platform.trustCenter.domains.relationships.title",
    descriptionKey: "platform.trustCenter.domains.relationships.description",
    statLabelKey: "platform.trustCenter.domains.relationships.stat",
    audiences: ["hr"],
    platformRoles: ["super_admin"],
  },
  {
    id: "actions",
    href: "/platform/trust/actions",
    icon: "check-circle",
    titleKey: "platform.trustCenter.domains.actions.title",
    descriptionKey: "platform.trustCenter.domains.actions.description",
    statLabelKey: "platform.trustCenter.domains.actions.stat",
    audiences: ["executive", "security"],
    platformRoles: ["super_admin", "platform_support"],
  },
  {
    id: "commercial",
    href: "/platform/trust/commercial",
    icon: "briefcase",
    titleKey: "platform.trustCenter.domains.commercial.title",
    descriptionKey: "platform.trustCenter.domains.commercial.description",
    statLabelKey: "platform.trustCenter.domains.commercial.stat",
    audiences: ["commercial", "executive"],
    platformRoles: ["super_admin", "platform_support"],
  },
  {
    id: "security",
    href: "/platform/trust/security",
    icon: "shield-check",
    titleKey: "platform.trustCenter.domains.security.title",
    descriptionKey: "platform.trustCenter.domains.security.description",
    statLabelKey: "platform.trustCenter.domains.security.stat",
    audiences: ["security", "executive"],
    platformRoles: ["super_admin", "platform_support"],
  },
  {
    id: "privacy",
    href: "/platform/trust/privacy",
    icon: "lock",
    titleKey: "platform.trustCenter.domains.privacy.title",
    descriptionKey: "platform.trustCenter.domains.privacy.description",
    statLabelKey: "platform.trustCenter.domains.privacy.stat",
    audiences: ["security", "executive"],
    platformRoles: ["super_admin", "platform_support"],
  },
];

const DOMAIN_PATHS = TRUST_DOMAINS.map((d) => d.href);

export function getTrustActiveNavId(pathname: string): TrustNavId {
  if (pathname.startsWith("/platform/trust/audit")) return "audit";
  if (pathname.startsWith("/platform/trust/privacy")) return "privacy";
  if (pathname.startsWith("/platform/trust/security")) return "security";
  if (pathname.startsWith("/platform/trust/actions")) return "actions";
  if (DOMAIN_PATHS.some((href) => pathname.startsWith(href) && href !== "/platform/trust/actions")) {
    return "domains";
  }
  return "overview";
}

export function filterTrustDomainsForRole(role: PlatformRole | null | undefined): TrustDomain[] {
  if (!role) return [];
  return TRUST_DOMAINS.filter((domain) => domain.platformRoles.includes(role));
}

export function canAccessTrustDomain(
  domainId: TrustDomainId,
  role: PlatformRole | null | undefined
): boolean {
  if (!role) return false;
  const domain = TRUST_DOMAINS.find((d) => d.id === domainId);
  return domain ? domain.platformRoles.includes(role) : false;
}

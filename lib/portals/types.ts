export const PORTAL_IDS = ["customer", "platform", "superAdmin"] as const;

export type PortalId = (typeof PORTAL_IDS)[number];

export type PortalDefinition = {
  id: PortalId;
  routePrefix: string;
  domain: string;
  purpose: string;
};

export type PlatformAccessProfile = {
  isPlatformAdmin: boolean;
  isSuperAdmin: boolean;
  role: string | null;
};

export type PortalRouteDecision =
  | { action: "continue" }
  | { action: "redirect"; pathname: string }
  | { action: "rewrite"; pathname: string };

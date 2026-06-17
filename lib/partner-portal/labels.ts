import { PARTNER_PORTAL_NAV } from "./nav-config";

export function buildPartnerPortalNavLabels(t: (key: string) => string): Record<string, string> {
  const p = "partnerPortal";
  return Object.fromEntries(
    PARTNER_PORTAL_NAV.map((item) => [item.id, t(`${p}.${item.labelKey}`)]),
  );
}

export function buildPartnerPortalSectionLabels(
  t: (key: string) => string,
  section: string,
): { title: string; subtitle: string } {
  const p = "partnerPortal";
  return {
    title: t(`${p}.sections.${section}.title`),
    subtitle: t(`${p}.sections.${section}.subtitle`),
  };
}

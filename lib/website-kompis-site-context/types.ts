/**
 * Kompis Web site context — Phase 1 presentation + APP write/read scoping.
 * Not Stripe, not quota, not frozen public retrieval changes.
 */

export type WebsiteKompisSiteScopeKind = "site_scoped" | "legacy_tenant_global";

export type WebsiteKompisOwnedSite = {
  /** Server-resolved installation id owned by the authenticated tenant. */
  installId: string;
  /** Verified/active customer_domains hostname bound to this install (display). */
  domain: string;
  verificationStatus: string;
  domainStatus: string;
  isPrimaryCandidate: boolean;
};

export type WebsiteKompisSiteContextState =
  | "unauthenticated"
  | "no_sites"
  | "single_site"
  | "multi_site"
  | "invalid_selection";

export type WebsiteKompisSiteContext = {
  state: WebsiteKompisSiteContextState;
  sites: WebsiteKompisOwnedSite[];
  /** Selected install when valid; auto-selected for single_site. */
  selectedInstallId: string | null;
  selectedDomain: string | null;
  /** True when selectedInstallId was supplied by client and rejected. */
  selectionRejected: boolean;
  /**
   * Cross-site isolation at visitor ask remains PARTIAL until Core search
   * stops matching install_id NULL across installs (requires separate SQL).
   */
  visitorIsolation: "partial_null_legacy_shared";
};

export type WebsiteKompisFaqScopeAnnotation = {
  scopeKind: WebsiteKompisSiteScopeKind;
  /** True when row install_id is null (legacy shared). */
  isLegacyTenantGlobal: boolean;
  /** True when row matches the selected install. */
  matchesSelectedSite: boolean;
};

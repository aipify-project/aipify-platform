/**
 * Site provision stays blocked until provision_website_kompis_site exists in
 * Production and a later owner approval turns this gate on.
 * This module must not call that RPC.
 */
export const WEBSITE_KOMPIS_SITE_PROVISION_LIVE = false;

export function websiteKompisSiteProvisionDecision(): {
  ok: false;
  code: "provision_unavailable";
  httpStatus: 409;
} {
  return {
    ok: false,
    code: "provision_unavailable",
    httpStatus: 409,
  };
}

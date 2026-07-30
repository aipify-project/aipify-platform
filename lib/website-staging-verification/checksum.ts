/**
 * Checksum helpers for the staging verification layer — re-exported from the
 * Website CMS checksum module so both verticals share one implementation.
 * The authoritative checksum is always computed server-side (md5 via
 * `_website_cms_checksum`) inside the staging candidate-build RPC.
 */

export {
  canonicalStringify,
  fingerprint,
  fingerprintContent,
  fingerprintsMatch,
} from "@/lib/website-cms/checksum";

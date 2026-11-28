import { presentLicenseStatusLabelKey } from "@/lib/license/license-center-presentation";
import type { Translator } from "@/lib/i18n/translate";

/**
 * Map Core license_status enums to existing Trust & License Center labels.
 * Never return the raw enum for customer-facing dashboard display.
 */
export function presentWorkspaceLicenseStatusLabel(
  licenseStatus: string | null | undefined,
  t: Translator
): string | null {
  const raw = licenseStatus?.trim() ?? "";
  if (!raw) return null;
  const key = presentLicenseStatusLabelKey(raw);
  return t(`license.center.subscription.${key}`);
}

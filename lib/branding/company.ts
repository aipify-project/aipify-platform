/** @deprecated Import from @/lib/company — AIPIFY_GROUP derives from company.config.ts */
import { toLegacyBrandGroup } from "@/lib/company/helpers";

/** Canonical Aipify Group AS brand foundation — see AIPIFY_GROUP_AS_BRAND_FOUNDATION.md */
export const AIPIFY_GROUP = toLegacyBrandGroup();

export type AipifyGroupBrand = typeof AIPIFY_GROUP;

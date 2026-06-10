import { MINIMUM_MARKETING_GROUP_SIZE } from "./types";

export function isPublicMarketingAllowed(tenantCount: number): boolean {
  return tenantCount >= MINIMUM_MARKETING_GROUP_SIZE;
}

export function formatImpactCount(value: number): string {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

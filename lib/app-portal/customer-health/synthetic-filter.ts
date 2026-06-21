export {
  isCustomerSuccessDemoModeEnabled,
  isSyntheticCustomerSuccessRecord,
} from "@/lib/app-portal/customer-success/synthetic-filter";

const SYNTHETIC_TEXT_PATTERN =
  /\b(synthetic|layout testing|layout test|mock data|mock record|demo dataset|design validation|test description|lorem ipsum|vendor sla attestation|executive briefing prep|enterprise renewal|external legal review|third-party outage|support queue saturation)\b/i;

export function isSyntheticCustomerHealthText(text: string | undefined): boolean {
  if (!text) return false;
  return SYNTHETIC_TEXT_PATTERN.test(text);
}

export function filterSyntheticHealthHistory<T extends { description?: string; event_type?: string }>(
  items: T[]
): T[] {
  return items.filter((item) => !isSyntheticCustomerHealthText(item.description ?? item.event_type));
}

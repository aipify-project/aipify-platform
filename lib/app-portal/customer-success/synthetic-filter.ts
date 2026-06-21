const SYNTHETIC_TEXT_PATTERN =
  /\b(synthetic|layout testing|layout test|mock data|mock record|demo dataset|design validation|test description|lorem ipsum|vendor sla attestation|executive briefing prep|enterprise renewal conversation|external legal review|third-party outage|support queue saturation during peak season)\b/i;

const SYNTHETIC_KEY_PREFIX = /^ps620:/i;

export function isCustomerSuccessDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CUSTOMER_SUCCESS_DEMO_MODE === "true";
}

export function isSyntheticCustomerSuccessRecord(record: {
  id?: string;
  title?: string;
  summary?: string;
  description?: string;
  showcase_key?: string;
  source?: string;
}): boolean {
  if (isCustomerSuccessDemoModeEnabled()) return false;

  const id = String(record.id ?? record.showcase_key ?? "");
  if (SYNTHETIC_KEY_PREFIX.test(id)) return true;

  const blob = [record.title, record.summary, record.description, record.source].filter(Boolean).join(" ");
  return SYNTHETIC_TEXT_PATTERN.test(blob);
}

export function filterSyntheticFollowUps<T extends { id: string; title: string; summary?: string }>(items: T[]): T[] {
  return items.filter((item) => !isSyntheticCustomerSuccessRecord(item));
}

export function filterSyntheticRisks<T extends { id: string; title: string; description?: string }>(items: T[]): T[] {
  return items.filter((item) => !isSyntheticCustomerSuccessRecord(item));
}

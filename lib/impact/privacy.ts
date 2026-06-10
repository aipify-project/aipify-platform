/** Fields and categories that must never appear in anonymised impact metrics (Phase 21). */

export const FORBIDDEN_METRIC_FIELDS = [
  "customer_name",
  "email",
  "email_content",
  "chat_content",
  "order_details",
  "sales_figure",
  "product_name",
  "inventory_quantity",
  "payment_details",
  "transaction_history",
  "personal_data",
  "business_record",
  "content",
  "message",
  "body",
] as const;

export const FORBIDDEN_METRIC_CATEGORIES = [
  "customer_identities",
  "customer_communications",
  "sensitive_business_records",
  "payment_details",
  "personal_identifiers",
  "sales_data",
  "order_data",
] as const;

export function containsForbiddenMetricField(payload: Record<string, unknown>): boolean {
  const keys = Object.keys(payload).map((k) => k.toLowerCase());
  return FORBIDDEN_METRIC_FIELDS.some((field) => keys.includes(field));
}

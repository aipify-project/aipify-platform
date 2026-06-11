/** What Aipify may store (Phase 19 §4). */
export const ALLOWED_STORAGE_CATEGORIES = [
  "tenant_information",
  "installation_metadata",
  "subscription_status",
  "skill_configuration",
  "presence_preferences",
  "executive_preferences",
  "recommendations",
  "learning_patterns",
  "audit_logs",
  "health_scores",
  "action_history",
  "update_history",
  "notification_preferences",
  "approval_policies",
  "assistant_context_metadata",
] as const;

/** Default prohibition — enterprise may override explicitly (Phase 19 §5). */
export const PROHIBITED_STORAGE_CATEGORIES = [
  "full_customer_databases",
  "customer_emails",
  "customer_conversations",
  "customer_attachments",
  "product_catalogs",
  "inventory_details",
  "payment_information",
  "credit_card_information",
  "payroll_information",
  "sensitive_hr_records",
  "government_identification",
  "complete_transaction_histories",
] as const;

export type StorageCategory =
  | (typeof ALLOWED_STORAGE_CATEGORIES)[number]
  | (typeof PROHIBITED_STORAGE_CATEGORIES)[number];

export function isProhibitedStorage(category: string): boolean {
  return (PROHIBITED_STORAGE_CATEGORIES as readonly string[]).includes(
    category
  );
}

export function assertStorageAllowed(category: string): void {
  if (isProhibitedStorage(category)) {
    throw new Error(
      `Storage category "${category}" is prohibited by default. Enterprise agreement required.`
    );
  }
}

/** Metadata-first example (Phase 19 §6). */
export const METADATA_FIRST_EXAMPLES = {
  doNotStore: [
    "Order #91827",
    "Customer name",
    "Shipping address",
  ],
  storeInstead: [
    "Increase in refund activity detected",
    "Refund trend increased by 18%",
    "Recommendation generated",
  ],
} as const;

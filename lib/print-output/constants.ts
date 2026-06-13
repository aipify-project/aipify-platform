export const PRINT_JOB_STATUSES = [
  "draft",
  "waiting_for_confirmation",
  "queued",
  "printing",
  "completed",
  "failed",
  "cancelled",
] as const;

export const PRINT_SENSITIVITY_LEVELS = ["standard", "sensitive", "confidential"] as const;

export const PRINT_PERMISSION_LEVELS = [
  "none",
  "own_documents",
  "department",
  "organization",
  "admin",
] as const;

export const PRINTER_CONNECTION_TYPES = [
  "local",
  "network",
  "shared",
  "cloud",
  "department",
] as const;

export const PRINTER_STATUSES = ["online", "offline", "unknown"] as const;

export const PRINTABLE_DOCUMENT_TYPES = [
  "meeting_notes",
  "report",
  "invoice",
  "contract",
  "checklist",
  "instructions",
  "customer_summary",
  "shipping_document",
  "approval_document",
  "training_material",
  "work_order",
  "daily_briefing",
  "executive_summary",
  "general",
] as const;

export const PRINT_OFFER_PROMPT_EN = "Should I print this for you?";
export const PRINT_OFFER_PROMPT_NO = "Skal jeg printe dette ut for deg?";
export const PRINT_OFFER_CONTEXTUAL_EN =
  "This may be useful to have physically. Should I print this for you?";
export const PRINT_OFFER_CONTEXTUAL_NO =
  "Dette kan være nyttig å ha fysisk. Skal jeg printe dette ut for deg?";
export const PRINT_FAILURE_FALLBACK_EN =
  "I could not print this. Would you like me to create a PDF instead?";
export const PRINT_FAILURE_FALLBACK_NO =
  "Jeg klarte ikke å printe dette. Vil du at jeg skal lage en PDF i stedet?";
export const PRINT_NO_PRINTER_FALLBACK_EN =
  "I do not have printer access right now, but I can prepare a PDF ready for printing.";
export const PRINT_NO_PRINTER_FALLBACK_NO =
  "Jeg har ikke tilgang til printer akkurat nå, men jeg kan lage en PDF klar til utskrift.";

export const PRINT_OUTPUT_ENGINE_PHILOSOPHY =
  "Aipify supports digital and physical output — users decide when printing is useful.";

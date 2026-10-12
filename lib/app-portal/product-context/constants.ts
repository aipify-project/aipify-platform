export const APP_PRODUCT_CONTEXT_COOKIE = "aipify_app_product_context";

export const APP_PRODUCT_CONTEXT_IDS = ["kompisWeb", "kompisBedrift"] as const;

export type AppProductContextId = (typeof APP_PRODUCT_CONTEXT_IDS)[number];

export function isAppProductContextId(value: string | null | undefined): value is AppProductContextId {
  return value === "kompisWeb" || value === "kompisBedrift";
}

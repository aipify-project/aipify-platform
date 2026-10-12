import {
  APP_PRODUCT_CONTEXT_IDS,
  isAppProductContextId,
  type AppProductContextId,
} from "./constants";
import { inferProductContextFromPathname } from "./infer-from-pathname";

export type ResolveActiveProductContextInput = {
  pathname?: string | null;
  cookieValue?: string | null;
  /** Products the user may open (from capability allowlist). */
  availableProducts: AppProductContextId[];
};

/**
 * Resolve which flat product menu to show.
 * Priority: pathname → cookie → first available.
 * Never returns a product the user cannot access.
 */
export function resolveActiveProductContext(
  input: ResolveActiveProductContextInput
): AppProductContextId | null {
  const available = APP_PRODUCT_CONTEXT_IDS.filter((id) => input.availableProducts.includes(id));
  if (available.length === 0) return null;

  const fromPath = input.pathname ? inferProductContextFromPathname(input.pathname) : null;
  if (fromPath && available.includes(fromPath)) return fromPath;

  if (isAppProductContextId(input.cookieValue) && available.includes(input.cookieValue)) {
    return input.cookieValue;
  }

  return available[0] ?? null;
}

export function productDashboardHref(product: AppProductContextId): string {
  return product === "kompisWeb" ? "/app/website-kompis" : "/app/kompis-bedrift";
}

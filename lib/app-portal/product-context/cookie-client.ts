import {
  APP_PRODUCT_CONTEXT_COOKIE,
  isAppProductContextId,
  type AppProductContextId,
} from "./constants";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function readProductContextCookie(): AppProductContextId | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${APP_PRODUCT_CONTEXT_COOKIE}=`));
  const value = match?.split("=")[1];
  return isAppProductContextId(value) ? value : null;
}

export function writeProductContextCookie(product: AppProductContextId): void {
  if (typeof document === "undefined") return;
  document.cookie = `${APP_PRODUCT_CONTEXT_COOKIE}=${product}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
}

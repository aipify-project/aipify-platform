import { UNONIGHT_AIPIFY_TOKEN_PREFIX } from "./constants";

export function maskUnonightAipifyTokenPrefix(prefix = UNONIGHT_AIPIFY_TOKEN_PREFIX): string {
  return `${prefix}••••••••`;
}

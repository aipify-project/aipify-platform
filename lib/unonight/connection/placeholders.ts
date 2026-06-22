import { UNONIGHT_PLACEHOLDER_TOKENS } from "./constants";

export function isUnonightPlaceholderToken(token: string | null | undefined): boolean {
  if (!token?.trim()) return true;
  const normalized = token.trim().toLowerCase();
  return UNONIGHT_PLACEHOLDER_TOKENS.some((entry) => normalized === entry.toLowerCase());
}

export function assertProductionUnonightToken(token: string): void {
  if (process.env.NODE_ENV === "production" && isUnonightPlaceholderToken(token)) {
    throw new Error("invalid_token");
  }
  if (isUnonightPlaceholderToken(token)) {
    throw new Error("invalid_token");
  }
}

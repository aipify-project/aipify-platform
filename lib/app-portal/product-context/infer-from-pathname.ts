import type { AppProductContextId } from "./constants";

/**
 * Infer product context from URL. Account routes return null (preserve cookie).
 * No SQL — presentation only.
 */
export function inferProductContextFromPathname(pathname: string): AppProductContextId | null {
  if (
    pathname.startsWith("/app/kompis-bedrift") ||
    pathname.startsWith("/app/organization") ||
    pathname.startsWith("/app/documents") ||
    pathname.startsWith("/app/operations/meetings") ||
    pathname.startsWith("/app/settings/employee-knowledge") ||
    pathname.startsWith("/app/settings/modules")
  ) {
    return "kompisBedrift";
  }

  if (
    pathname.startsWith("/app/website-kompis") ||
    pathname.startsWith("/app/domains") ||
    pathname.startsWith("/app/software")
  ) {
    return "kompisWeb";
  }

  return null;
}

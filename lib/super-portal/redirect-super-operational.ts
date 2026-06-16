import { redirect } from "next/navigation";
import { getSuperOperationalRedirect } from "./operational-redirects";

/** Redirect legacy SUPER operational routes to PLATFORM (Phase 257). */
export function redirectSuperOperational(pathname: string): never {
  redirect(getSuperOperationalRedirect(pathname) ?? "/platform");
}

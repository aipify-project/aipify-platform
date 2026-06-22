import { MODERN_INSTALL_ROUTE } from "@/lib/install/experience";

/** Public Knowledge Center article explaining business installation (not PWA). */
export const LOGIN_INSTALL_HELP_ARTICLE_SLUG = "how-aipify-install-works";

/** Canonical post-auth install destination. */
export const LOGIN_INSTALL_DESTINATION = MODERN_INSTALL_ROUTE;

/**
 * From the login portal, route through customer sign-in with a safe `next` path.
 * Unauthenticated `/app/install` redirects to login without `portal=customer`.
 */
export function getLoginInstallStartHref(): string {
  const params = new URLSearchParams({
    portal: "customer",
    next: LOGIN_INSTALL_DESTINATION,
  });
  return `/login?${params.toString()}`;
}

export function getLoginInstallHelpHref(): string {
  return `/knowledge/articles/${LOGIN_INSTALL_HELP_ARTICLE_SLUG}`;
}

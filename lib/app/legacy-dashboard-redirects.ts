/**
 * Legacy Customer Control Center paths (/dashboard/*) → canonical APP routes (/app/*).
 * Used by next.config redirects and verification scripts.
 */
export type LegacyDashboardRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

/** Ordered: specific rules before the catch-all. */
export const LEGACY_DASHBOARD_REDIRECTS: LegacyDashboardRedirect[] = [
  { source: "/dashboard", destination: "/app", permanent: false },
  { source: "/dashboard/installs", destination: "/app/installations", permanent: false },
  { source: "/dashboard/installs/:path*", destination: "/app/installations/:path*", permanent: false },
  { source: "/dashboard/support", destination: "/app/support/history", permanent: false },
  { source: "/dashboard/support/:path*", destination: "/app/support/:path*", permanent: false },
  { source: "/dashboard/intelligence/:path*", destination: "/app/intelligence/:path*", permanent: false },
  { source: "/dashboard/settings/:path*", destination: "/app/settings/:path*", permanent: false },
  { source: "/dashboard/:path*", destination: "/app/:path*", permanent: false },
];

export function resolveLegacyDashboardPath(pathname: string): string | null {
  if (pathname === "/dashboard") return "/app";
  if (!pathname.startsWith("/dashboard/")) return null;

  const rest = pathname.slice("/dashboard".length);

  if (rest === "/installs" || rest.startsWith("/installs/")) {
    return `/app/installations${rest.slice("/installs".length)}`;
  }
  if (rest === "/support") return "/app/support/history";
  if (rest.startsWith("/support/")) return `/app/support${rest.slice("/support".length)}`;
  if (rest.startsWith("/intelligence/")) return `/app/intelligence${rest.slice("/intelligence".length)}`;
  if (rest.startsWith("/settings/")) return `/app/settings${rest.slice("/settings".length)}`;

  return `/app${rest}`;
}

export type PortalSessionProbeResult =
  | { status: "authenticated"; userId: string }
  | { status: "unauthenticated" }
  | { status: "transient"; reason: "network" | "server" };

/** Server-backed session probe — middleware refreshes cookies; never calls client refreshSession. */
export async function probePortalSession(): Promise<PortalSessionProbeResult> {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | { authenticated?: boolean; userId?: string; transient?: boolean }
      | null;

    if (response.ok && payload?.authenticated && payload.userId) {
      return { status: "authenticated", userId: payload.userId };
    }

    if (response.status === 503 || payload?.transient) {
      return { status: "transient", reason: "server" };
    }

    return { status: "unauthenticated" };
  } catch {
    return { status: "transient", reason: "network" };
  }
}

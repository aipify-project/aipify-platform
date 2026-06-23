export type PortalSessionProbeResult =
  | { status: "authenticated"; userId: string }
  | { status: "unauthenticated" }
  | { status: "transient"; reason: "network" | "server" };

const PROBE_RETRY_DELAYS_MS = [0, 350, 900] as const;

async function fetchPortalSessionProbe(): Promise<PortalSessionProbeResult> {
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
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Server-backed session probe — proxy owns refresh; retries recover refresh-token rotation races. */
export async function probePortalSession(
  options: { attempts?: number } = {},
): Promise<PortalSessionProbeResult> {
  const attempts = options.attempts ?? PROBE_RETRY_DELAYS_MS.length;

  try {
    for (let index = 0; index < attempts; index += 1) {
      const delay = PROBE_RETRY_DELAYS_MS[index] ?? PROBE_RETRY_DELAYS_MS.at(-1)!;
      if (delay > 0) {
        await wait(delay);
      }

      const result = await fetchPortalSessionProbe();
      if (result.status === "authenticated" || result.status === "transient") {
        return result;
      }
    }

    return { status: "unauthenticated" };
  } catch {
    return { status: "transient", reason: "network" };
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  PLATFORM_LIVE_PRESENCE_HEARTBEAT_RPC,
  PLATFORM_LIVE_PRESENCE_PORTALS,
  type PlatformLivePresencePortal,
} from "@/lib/platform-portal/live-presence/constants";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function isPortal(value: unknown): value is PlatformLivePresencePortal {
  return (
    typeof value === "string" &&
    (PLATFORM_LIVE_PRESENCE_PORTALS as readonly string[]).includes(value)
  );
}

/**
 * Authenticated presence heartbeat writer.
 * Fail closed when Core RPC is not applied. No service role. No PII in response.
 * APP/SELLER shell mounting is coordinated separately after SQL approval (Agents 1/2).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "unauthorized" },
        { status: 401, headers: NO_STORE },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON", code: "invalid_body" },
        { status: 400, headers: NO_STORE },
      );
    }

    const record =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : null;
    const portal = record?.portal;
    const clientInstanceId = record?.clientInstanceId;
    if (!isPortal(portal) || typeof clientInstanceId !== "string" || clientInstanceId.trim().length < 8) {
      return NextResponse.json(
        { error: "Invalid portal or client instance", code: "invalid_body" },
        { status: 400, headers: NO_STORE },
      );
    }

    const { data, error } = await supabase.rpc(PLATFORM_LIVE_PRESENCE_HEARTBEAT_RPC, {
      p_portal: portal,
      p_client_instance_id: clientInstanceId.trim().slice(0, 64),
    });

    if (error) {
      const message = error.message ?? "";
      if (/not authorized|portal claim denied|not authenticated/i.test(message)) {
        return NextResponse.json(
          { error: "Forbidden", code: "forbidden" },
          { status: 403, headers: NO_STORE },
        );
      }
      // RPC missing until SQL candidate is applied — fail closed, no fake ok.
      return NextResponse.json(
        { error: "Presence writer unavailable", code: "not_measured" },
        { status: 503, headers: NO_STORE },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        result:
          data && typeof data === "object" && !Array.isArray(data)
            ? {
                throttled: Boolean((data as { throttled?: unknown }).throttled),
                portal:
                  typeof (data as { portal?: unknown }).portal === "string"
                    ? (data as { portal: string }).portal
                    : portal,
              }
            : { throttled: false, portal },
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to record heartbeat", code: "unavailable" },
      { status: 500, headers: NO_STORE },
    );
  }
}

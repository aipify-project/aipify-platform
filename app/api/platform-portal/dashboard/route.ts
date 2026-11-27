import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlatformSupportTicketCounts } from "@/lib/platform-portal/support-tickets-read-adapter";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET() {
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

    const profile = await getPlatformProfile(supabase);
    if (!profile) {
      return NextResponse.json(
        { error: "Forbidden", code: "forbidden" },
        { status: 403, headers: NO_STORE },
      );
    }

    const { data, error } = await supabase.rpc("get_platform_portal_dashboard");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 403, headers: NO_STORE },
      );
    }

    const inbox = await getPlatformSupportTicketCounts(supabase);
    const supportInbox = inbox.ok
      ? {
          state: "value" as const,
          open: inbox.counts.open,
          waiting: inbox.counts.waiting,
          resolved_or_closed: inbox.counts.resolved_or_closed,
          source: inbox.source,
        }
      : { state: "unavailable" as const };

    const payload =
      data && typeof data === "object" && !Array.isArray(data)
        ? (data as Record<string, unknown>)
        : {};

    return NextResponse.json(
      {
        ...payload,
        checked_at: new Date().toISOString(),
        support_inbox: supportInbox,
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load platform dashboard." },
      { status: 500, headers: NO_STORE },
    );
  }
}

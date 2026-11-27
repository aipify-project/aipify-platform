import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    return NextResponse.json(data, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "Unable to load platform dashboard." },
      { status: 500, headers: NO_STORE },
    );
  }
}

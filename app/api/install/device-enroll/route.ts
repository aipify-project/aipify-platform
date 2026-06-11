import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Install Engine device enrollment API (Phase A.39).
 * Thin client — business logic in register_device / record_device_heartbeat RPCs.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const action = (body.action as string) ?? "register";

    if (action === "heartbeat") {
      const { data, error } = await supabase.rpc("record_device_heartbeat", {
        p_device_identifier: body.device_identifier as string,
        p_companion_version: (body.companion_version as string) ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("register_device", {
      p_device_name: body.device_name as string,
      p_device_type: (body.device_type as string) ?? "desktop",
      p_os: (body.os as string) ?? null,
      p_companion_version: (body.companion_version as string) ?? null,
      p_device_identifier: (body.device_identifier as string) ?? null,
      p_enrollment_method: (body.enrollment_method as string) ?? "silent_install",
      p_enrollment_token: (body.enrollment_token as string) ?? null,
      p_metadata: (body.metadata as Record<string, unknown>) ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Device enrollment failed" }, { status: 500 });
  }
}

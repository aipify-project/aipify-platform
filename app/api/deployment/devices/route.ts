import { NextResponse } from "next/server";
import { parseRegisteredDevices } from "@/lib/aipify/enterprise-deployment-device-rollout-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_registered_devices");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseRegisteredDevices(data));
  } catch {
    return NextResponse.json({ error: "Failed to list devices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("register_device", {
      p_device_name: body.device_name as string,
      p_device_type: (body.device_type as string) ?? "desktop",
      p_os: (body.os as string) ?? null,
      p_companion_version: (body.companion_version as string) ?? null,
      p_device_identifier: (body.device_identifier as string) ?? null,
      p_enrollment_method: (body.enrollment_method as string) ?? "enrollment_token",
      p_enrollment_token: (body.enrollment_token as string) ?? null,
      p_metadata: (body.metadata as Record<string, unknown>) ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to register device" }, { status: 500 });
  }
}

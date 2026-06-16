import { NextResponse } from "next/server";
import { parsePlatformHealthOperationsCenter } from "@/lib/platform-health-operations-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_platform_health_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePlatformHealthOperationsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load platform health operations center" },
      { status: 500 }
    );
  }
}

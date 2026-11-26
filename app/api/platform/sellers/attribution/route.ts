import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { listCspAttributionLinks } from "@/lib/certified-sales-partner/platform-sellers-lists";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const result = await listCspAttributionLinks();
    if (result.kind === "error") {
      return NextResponse.json(
        { found: false, error: "attribution_load_failed" },
        { status: 503 },
      );
    }
    return NextResponse.json({ found: true, rows: result.rows });
  } catch {
    return NextResponse.json({ found: false, error: "attribution_load_failed" }, { status: 500 });
  }
}

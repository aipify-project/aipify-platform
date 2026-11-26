import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { listCspAuditEvents } from "@/lib/certified-sales-partner/platform-sellers-lists";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const url = new URL(request.url);
    const limitRaw = Number(url.searchParams.get("limit") ?? "200");
    const limit = Number.isFinite(limitRaw) ? limitRaw : 200;

    const result = await listCspAuditEvents(limit);
    if (result.kind === "error") {
      return NextResponse.json(
        { found: false, error: "audit_load_failed" },
        { status: 503 },
      );
    }
    return NextResponse.json({ found: true, rows: result.rows });
  } catch {
    return NextResponse.json({ found: false, error: "audit_load_failed" }, { status: 500 });
  }
}

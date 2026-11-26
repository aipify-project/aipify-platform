import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Platform Admin event list. Message bodies are not included. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;
    const result = await callCspRpc<{ ready?: boolean; ok?: boolean; code?: string; events?: unknown[] }>(
      supabase,
      "csp_sales_email_admin_list",
    );
    if (!result.ready) {
      return NextResponse.json(
        { found: false, backend_ready: false, code: "persistence_not_ready" },
        { status: 503, headers: NO_STORE },
      );
    }
    if (result.data.ok !== true) {
      const status = result.data.code === "forbidden" ? 403 : 503;
      return NextResponse.json(
        { found: false, backend_ready: result.data.ready === true, code: result.data.code ?? "persistence_not_ready" },
        { status, headers: NO_STORE },
      );
    }
    return NextResponse.json(
      { found: true, backend_ready: true, events: result.data.events ?? [] },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "sales_email_admin_failed" }, { status: 500, headers: NO_STORE });
  }
}

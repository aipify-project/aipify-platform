import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      format?: string;
      filters?: Record<string, unknown>;
    };
    const format = body.format ?? "csv";
    if (!["csv", "xlsx", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("export_audit_logs", {
      p_format: format,
      p_filters: body.filters ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to export audit logs" }, { status: 500 });
  }
}

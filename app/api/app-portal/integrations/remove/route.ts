import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { connection_id?: string };
    if (!body.connection_id) {
      return NextResponse.json({ error: "connection_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("remove_app_portal_integration_connection", {
      p_connection_id: body.connection_id,
    });

    if (error) {
      const message = error.message.toLowerCase();
      const status = message.includes("requires owner") || message.includes("permission") ? 403 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to remove integration" }, { status: 500 });
  }
}

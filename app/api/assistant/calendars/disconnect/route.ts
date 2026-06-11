import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { connection_id?: string };
    if (!body.connection_id) {
      return NextResponse.json({ error: "connection_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("disconnect_calendar", {
      p_connection_id: body.connection_id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Calendar disconnect failed" }, { status: 500 });
  }
}

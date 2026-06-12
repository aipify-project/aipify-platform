import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { archived_record_id?: string };
    if (!body.archived_record_id) {
      return NextResponse.json({ error: "archived_record_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("restore_archived_record", {
      p_archived_record_id: body.archived_record_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to restore archived record" }, { status: 500 });
  }
}

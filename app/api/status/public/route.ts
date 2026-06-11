import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_public_status");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({ error: "Failed to load public status" }, { status: 500 });
  }
}

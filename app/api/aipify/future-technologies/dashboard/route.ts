import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFutureTechnologiesDashboard } from "@/lib/aipify/future-technologies";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_future_technologies_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseFutureTechnologiesDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load future technologies dashboard" }, { status: 500 });
  }
}

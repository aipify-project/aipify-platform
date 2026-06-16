import { NextResponse } from "next/server";
import { getAipifyHostsCommunicationCenterCard } from "@/lib/core/aipify-hosts-communication-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsCommunicationCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load communication card" }, { status: 500 });
  }
}

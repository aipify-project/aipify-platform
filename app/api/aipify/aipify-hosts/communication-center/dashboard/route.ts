import { NextResponse } from "next/server";
import { getAipifyHostsCommunicationCenterDashboard } from "@/lib/core/aipify-hosts-communication-center";
import { parseAipifyHostsCommunicationCenterDashboard } from "@/lib/aipify/aipify-hosts-communication-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const section = url.searchParams.get("section") ?? "guest_communications";
    const data = await getAipifyHostsCommunicationCenterDashboard(supabase, section, {
      propertyId: url.searchParams.get("property_id"),
      status: url.searchParams.get("status"),
      recipientType: url.searchParams.get("recipient_type"),
    });
    const parsed = parseAipifyHostsCommunicationCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load communication center" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { parseCommunicationCampaignExportPayload } from "@/lib/aipify/stakeholder-communication-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("export_communication_campaigns", {
      p_status_filter: searchParams.get("status") ?? null,
      p_communication_type: searchParams.get("communication_type") ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommunicationCampaignExportPayload(data));
  } catch {
    return NextResponse.json({ error: "Failed to export campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      status_filter?: string;
      communication_type?: string;
    };

    const { data, error } = await supabase.rpc("export_communication_campaigns", {
      p_status_filter: body.status_filter ?? null,
      p_communication_type: body.communication_type ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommunicationCampaignExportPayload(data));
  } catch {
    return NextResponse.json({ error: "Failed to export campaigns" }, { status: 500 });
  }
}

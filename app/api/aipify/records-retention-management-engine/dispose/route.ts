import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      archived_record_id?: string;
      disposal_request_id?: string;
      approved?: boolean;
      reason?: string;
    };

    if (body.action === "approve") {
      if (!body.disposal_request_id) {
        return NextResponse.json({ error: "disposal_request_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("approve_record_disposal", {
        p_disposal_request_id: body.disposal_request_id,
        p_approved: body.approved ?? true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "complete") {
      if (!body.disposal_request_id) {
        return NextResponse.json({ error: "disposal_request_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("complete_record_disposal", {
        p_disposal_request_id: body.disposal_request_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.archived_record_id) {
      return NextResponse.json({ error: "archived_record_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("request_record_disposal", {
      p_archived_record_id: body.archived_record_id,
      p_reason: body.reason ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process disposal action" }, { status: 500 });
  }
}

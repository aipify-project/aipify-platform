import { NextResponse } from "next/server";
import {
  parseOrganizationContextGap,
  parseOrganizationContextGaps,
} from "@/lib/aipify/context-intelligence-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "open";
    const limit = Number(searchParams.get("limit") ?? "50");

    const { data, error } = await supabase.rpc("list_organization_context_gaps", {
      p_status: status,
      p_limit: limit,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationContextGaps(data));
  } catch {
    return NextResponse.json({ error: "Failed to list gaps" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      gap_id?: string;
      resolution_note?: string;
      status?: string;
    };

    if (!body.gap_id) {
      return NextResponse.json({ error: "gap_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("resolve_organization_context_gap", {
      p_gap_id: body.gap_id,
      p_resolution_note: body.resolution_note ?? null,
      p_status: body.status ?? "resolved",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const gap = parseOrganizationContextGap(data);
    return NextResponse.json(gap ?? { error: "Invalid response" }, { status: gap ? 200 : 500 });
  } catch {
    return NextResponse.json({ error: "Failed to resolve gap" }, { status: 500 });
  }
}

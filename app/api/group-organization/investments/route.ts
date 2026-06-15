import { NextResponse } from "next/server";
import { parseGroupInvestment } from "@/lib/group-organization";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const companyName = String(body.company_name ?? "").trim();
    if (!companyName) {
      return NextResponse.json({ error: "company_name is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("upsert_group_investment", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseGroupInvestment(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Investment update failed" }, { status: 500 });
  }
}

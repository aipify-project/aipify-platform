import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { query?: string; category?: string };
    const query = (body.query ?? "").trim();
    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("search_employee_knowledge", {
      p_query: query,
      p_category: body.category ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Employee knowledge search failed" }, { status: 500 });
  }
}

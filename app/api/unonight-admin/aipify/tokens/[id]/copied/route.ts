import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientIpFromRequest } from "@/lib/unonight-platform";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("record_unonight_aipify_token_copied", {
      p_token_id: id,
      p_request_ip: clientIpFromRequest(request),
    });

    if (error) {
      return NextResponse.json({ error: "Unable to record copy" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to record copy" }, { status: 500 });
  }
}

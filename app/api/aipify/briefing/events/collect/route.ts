import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { collectBriefingEventsJob } from "@/lib/aipify/briefing/jobs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const since = (body as { since?: string }).since;
    const tenantSlug = (body as { tenant_slug?: string }).tenant_slug ?? "unonight";

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await collectBriefingEventsJob(fetcher, since, { tenantSlug });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Collect failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

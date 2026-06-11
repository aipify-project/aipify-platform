import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBriefingFull } from "@/lib/aipify/briefing";
import { generateSinceLastLoginJob } from "@/lib/aipify/briefing/jobs";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await generateSinceLastLoginJob(fetcher);
    return NextResponse.json(parseBriefingFull(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generate failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

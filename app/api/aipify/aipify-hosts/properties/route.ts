import { NextResponse } from "next/server";
import { createAipifyHostsProperty } from "@/lib/core/aipify-hosts";
import { parseCreateAipifyHostsPropertyResult } from "@/lib/aipify/aipify-hosts/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      display_name?: string;
      platform_source?: string;
      property_key?: string;
    };
    if (!body.display_name?.trim()) {
      return NextResponse.json({ error: "display_name is required" }, { status: 400 });
    }

    const data = await createAipifyHostsProperty(supabase, {
      display_name: body.display_name.trim(),
      platform_source: body.platform_source,
      property_key: body.property_key,
    });
    const parsed = parseCreateAipifyHostsPropertyResult(data);
    if (!parsed.success) {
      return NextResponse.json(parsed, { status: 409 });
    }
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}

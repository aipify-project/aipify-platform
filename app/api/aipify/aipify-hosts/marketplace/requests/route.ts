import { NextResponse } from "next/server";
import { createAipifyHostsMarketplaceRequest } from "@/lib/core/aipify-hosts-marketplace";
import { parseCreateMarketplaceRequestResult } from "@/lib/aipify/aipify-hosts-marketplace/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      provider_id?: string;
      service_category?: string;
      summary?: string;
      property_id?: string;
    };
    if (!body.provider_id || !body.service_category || !body.summary?.trim()) {
      return NextResponse.json({ error: "provider_id, service_category, and summary are required" }, { status: 400 });
    }

    const data = await createAipifyHostsMarketplaceRequest(supabase, {
      provider_id: body.provider_id,
      service_category: body.service_category,
      summary: body.summary.trim(),
      property_id: body.property_id,
    });
    return NextResponse.json(parseCreateMarketplaceRequestResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}

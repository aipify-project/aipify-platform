import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseWebsiteKompisFaqActionResult } from "@/lib/website-kompis-faq/parse";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ) {
      return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("unpublish_tenant_public_companion_faq_item", {
      p_item_id: id.toLowerCase(),
    });
    if (error) {
      const statusCode = /owner or admin/i.test(error.message) ? 403 : 400;
      return NextResponse.json({ error: error.message }, { status: statusCode });
    }

    return NextResponse.json(parseWebsiteKompisFaqActionResult(data));
  } catch {
    return NextResponse.json({ error: "FAQ unpublish failed" }, { status: 500 });
  }
}

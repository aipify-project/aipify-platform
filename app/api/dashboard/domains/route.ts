import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCustomerDomainsOverview } from "@/lib/platform/license";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("get_customer_domains_overview");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(parseCustomerDomainsOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load domains" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const domain = typeof body.domain === "string" ? body.domain.trim() : "";

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("add_customer_domain", {
      p_domain: domain,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ domain: data });
  } catch {
    return NextResponse.json({ error: "Failed to add domain" }, { status: 500 });
  }
}

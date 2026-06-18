import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEnterpriseConnectors } from "@/lib/aipify/enterprise/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_enterprise_connectors");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ connectors: parseEnterpriseConnectors(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list connectors" }, { status: 500 });
  }
}

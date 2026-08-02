import { NextResponse } from "next/server";
import { parseKompisCustomerWorkspaceContract } from "@/lib/kompis-customer-workspace";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_kompis_customer_workspace_contract");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }

    const row = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    const rawContract = row.contract;
    const parsed =
      rawContract && typeof rawContract === "object" && Object.keys(rawContract as object).length
        ? parseKompisCustomerWorkspaceContract(rawContract)
        : null;

    return NextResponse.json(
      {
        enabled: row.enabled === true,
        status: row.status ?? "missing",
        fail_closed: true,
        contract: parsed?.ok ? parsed.contract : null,
        parse_ok: parsed?.ok ?? false,
      },
      { headers: NO_STORE }
    );
  } catch {
    return NextResponse.json({ error: "Failed to load workspace contract" }, { status: 500, headers: NO_STORE });
  }
}

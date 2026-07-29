import { NextResponse } from "next/server";
import {
  mapWebsiteKompisActivationRpcError,
  parseActivateWebsiteKompisInput,
  parsePlatformPortalWebsiteKompisActivationResult,
  parsePlatformPortalWebsiteKompisStatus,
} from "@/lib/platform-portal/website-kompis-activation";
import { createClient } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "no-store" };
const fail = (error: string, status: number, code: string) =>
  NextResponse.json({ error, code }, { status, headers });

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!UUID.test(id ?? "")) return fail("Invalid customer id.", 400, "invalid_customer");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");
    const { data, error } = await supabase.rpc("get_platform_portal_customer_website_kompis_status", { p_customer_id: id });
    if (error) { const mapped = mapWebsiteKompisActivationRpcError(error.message); return fail("Unable to load Website Kompis status.", mapped.status, mapped.code); }
    if (data == null) return fail("Customer not found.", 404, "customer_not_found");
    const parsed = parsePlatformPortalWebsiteKompisStatus(data);
    return parsed ? NextResponse.json(parsed, { headers }) : fail("Unable to load Website Kompis status.", 500, "unknown");
  } catch { return fail("Unable to load Website Kompis status.", 500, "unknown"); }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fail("Unauthorized", 401, "unauthorized");
    const input = parseActivateWebsiteKompisInput(id ?? "", await request.json().catch(() => null));
    if (!input.ok) return fail("Invalid Website Kompis activation input.", 400, input.code);
    const { data, error } = await supabase.rpc("activate_platform_portal_customer_website_kompis", {
      p_customer_id: input.value.customerId, p_internal_reason: input.value.internalReason,
      p_confirmation: input.value.confirmation, p_idempotency_key: input.value.idempotencyKey,
    });
    if (error) { const mapped = mapWebsiteKompisActivationRpcError(error.message); return fail("Unable to activate Website Kompis.", mapped.status, mapped.code); }
    const parsed = parsePlatformPortalWebsiteKompisActivationResult(data);
    if (!parsed) return fail("Unable to activate Website Kompis.", 500, "unknown");
    return NextResponse.json(parsed, { status: parsed.created ? 201 : 200, headers });
  } catch { return fail("Unable to activate Website Kompis.", 500, "unknown"); }
}

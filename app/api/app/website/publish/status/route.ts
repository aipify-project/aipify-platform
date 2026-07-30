import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { mapKompisOperatorRpcError } from "@/lib/kompis-operator/parse";

const headers = { "Cache-Control": "no-store" };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * GET — reads the publish/rollback operation ledger (`get_customer_website_publish_history`).
 * With `?operationId=<uuid>` returns that single operation; otherwise returns the full history.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const url = new URL(request.url);
    const operationId = url.searchParams.get("operationId");
    const limitParam = Number(url.searchParams.get("limit") ?? 20);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;

    const { data, error } = await supabase.rpc("get_customer_website_publish_history", {
      p_limit: operationId ? 100 : limit,
    });
    if (error) {
      const mapped = mapKompisOperatorRpcError(error.message);
      return NextResponse.json(
        { error: "Publish status could not be loaded.", code: mapped.code },
        { status: mapped.status, headers },
      );
    }

    const operations = asArray(record(data).operations).map(record);
    if (!operationId) {
      return NextResponse.json({ operations }, { headers });
    }

    const operation = operations.find((op) => op.id === operationId);
    if (!operation) {
      return NextResponse.json({ error: "Operation was not found.", code: "operation_not_found" }, { status: 404, headers });
    }
    return NextResponse.json({ operation }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Publish status could not be loaded.", code: "unknown" },
      { status: 500, headers },
    );
  }
}

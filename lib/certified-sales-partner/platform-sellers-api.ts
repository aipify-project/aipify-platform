/**
 * Shared GET handler for Platform > Selgere list routes.
 * Platform-guarded and fail-closed: a list is only returned when the loader succeeded.
 * Never returns invented rows — an unreachable/unapplied Core table is `503 not ready`.
 */
import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { buildPlatformListBody } from "@/lib/certified-sales-partner/platform-sellers-ops-view";
import type { PlatformListResult } from "@/lib/certified-sales-partner/platform-sellers-lists";
import { createClient } from "@/lib/supabase/server";

export async function handlePlatformSellersListGet<T>(
  load: () => Promise<PlatformListResult<T>>,
  errorCode: string,
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const built = buildPlatformListBody(await load());
    if (built.status === 500) {
      return NextResponse.json({ found: false, error: errorCode }, { status: 500 });
    }
    return NextResponse.json(built.body, { status: built.status });
  } catch {
    return NextResponse.json({ found: false, error: errorCode }, { status: 500 });
  }
}

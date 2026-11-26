import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { listCspSellerRanking } from "@/lib/certified-sales-partner/platform-sellers-lists";
import { loadPartnerAvatarUrls, searchSellerEmails } from "@/lib/certified-sales-partner/seller-directory-server";
import { safeAvatarUrl } from "@/lib/certified-sales-partner/seller-avatar";
import { sortSellerRanking, type SellerRankRow } from "@/lib/certified-sales-partner/seller-ranking";
import { createClient } from "@/lib/supabase/server";

const AVATAR_BACKFILL = 12;

/**
 * Platform Admin seller ranking (GET only, read-only).
 * - `GET /api/platform/sellers/ranking` → all sellers, ranked by clicks (default).
 * - `GET /api/platform/sellers/ranking?email=<fragment>` → partners whose sign-in email matches.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const url = new URL(request.url);
    const emailQuery = url.searchParams.get("email");
    if (emailQuery !== null) {
      const matches = await searchSellerEmails(emailQuery.slice(0, 120));
      if (matches === null) return NextResponse.json({ error: "seller_email_search_failed" }, { status: 500 });
      return NextResponse.json({ matches }, { headers: { "Cache-Control": "no-store" } });
    }

    const result = await listCspSellerRanking();
    if (result.kind === "error") {
      return NextResponse.json({ error: "seller_ranking_failed" }, { status: 500 });
    }

    const sorted: SellerRankRow[] = sortSellerRanking(
      result.rows.map((r) => ({
        partnerId: r.partnerId,
        displayName: r.displayName,
        country: r.country,
        status: r.status,
        clicks: r.clicks,
        registrations: r.registrations,
        qualifiedSales: r.qualifiedSales,
        // Raw metadata may hold the seller-portal pointer; only admin-safe URLs leave this route.
        avatarUrl: safeAvatarUrl(r.avatarUrl, r.partnerId),
      })),
      "clicks",
    );

    // The ranking loader reads avatars for a bounded set of partners; make sure the leaders have theirs.
    const missing = sorted
      .slice(0, AVATAR_BACKFILL)
      .filter((r) => !r.avatarUrl)
      .map((r) => r.partnerId);
    if (missing.length > 0) {
      const avatars = await loadPartnerAvatarUrls(missing);
      for (const row of sorted) {
        const url = avatars.get(row.partnerId);
        if (url) row.avatarUrl = url;
      }
    }

    return NextResponse.json({ sellers: sorted }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "seller_ranking_failed" }, { status: 500 });
  }
}

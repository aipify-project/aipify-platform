/**
 * Server-only helpers for the seller directory (ranking avatars, email search).
 * Callers must have passed the platform privileged guard. Service role; read-only.
 */
import { extractAvatarUrlFromMetadata } from "@/lib/certified-sales-partner/seller-avatar";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Row = Record<string, unknown>;

const DIRECTORY_LIMIT = 500;
const CONCURRENCY = 8;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

/** Avatar URLs (from auth user metadata) for the given partner ids. Missing → not in the map. */
export async function loadPartnerAvatarUrls(partnerIds: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const ids = [...new Set(partnerIds)].slice(0, 50);
  if (ids.length === 0) return result;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.from("csp_partner_profiles").select("id, auth_user_id").in("id", ids);
    if (error || !Array.isArray(data)) return result;
    await mapWithConcurrency(data as Row[], CONCURRENCY, async (row) => {
      const id = str(row.id);
      const authId = str(row.auth_user_id);
      if (!id || !authId) return;
      try {
        const { data: user } = await admin.auth.admin.getUserById(authId);
        const url = extractAvatarUrlFromMetadata(user?.user?.user_metadata, id);
        if (url) result.set(id, url);
      } catch {
        /* no avatar */
      }
    });
  } catch {
    /* no avatars */
  }
  return result;
}

export type SellerEmailMatch = { partnerId: string; email: string };

/**
 * Partners whose sign-in email contains `query` (case-insensitive). Reads every partner's auth identity
 * (bounded to the directory limit) so the search covers ALL sellers, not only the top ones.
 * Returns `null` when the directory could not be read.
 */
export async function searchSellerEmails(query: string): Promise<SellerEmailMatch[] | null> {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_partner_profiles")
      .select("id, auth_user_id")
      .limit(DIRECTORY_LIMIT);
    if (error || !Array.isArray(data)) return null;
    const rows = (data as Row[]).flatMap((r) => {
      const id = str(r.id);
      const authId = str(r.auth_user_id);
      return id && authId ? [{ id, authId }] : [];
    });
    const found = await mapWithConcurrency(rows, CONCURRENCY, async ({ id, authId }) => {
      try {
        const { data: user } = await admin.auth.admin.getUserById(authId);
        const email = user?.user?.email ?? null;
        return email && email.toLowerCase().includes(q) ? ({ partnerId: id, email } as SellerEmailMatch) : null;
      } catch {
        return null;
      }
    });
    return found.filter((m): m is SellerEmailMatch => m !== null);
  } catch {
    return null;
  }
}

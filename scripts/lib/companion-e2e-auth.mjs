/**
 * Shared Supabase session cookie builder for Companion E2E scripts.
 * Must include session.user — @supabase/ssr rejects token-only payloads.
 */
export function buildSupabaseAuthCookieHeader(session, supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const payload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  });
  return `${cookieName}=${encodeURIComponent(payload)}`;
}

export function buildSupabaseAuthPlaywrightCookies(session, baseUrl, supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const payload = JSON.stringify({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  });
  return [
    { name: cookieName, value: payload, url: baseUrl },
    { name: cookieName, value: payload, url: `${baseUrl}/app` },
  ];
}

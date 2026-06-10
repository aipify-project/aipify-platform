import { createClient } from "@/lib/supabase/server";
import { DESKTOP_SESSION_HEADER } from "./security";

export type DesktopSessionContext = {
  tenant_id: string;
  user_id: string;
  client_id: string;
};

export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get(DESKTOP_SESSION_HEADER);
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export async function validateDesktopRequest(
  request: Request
): Promise<DesktopSessionContext | null> {
  const token = extractBearerToken(request);
  if (!token) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("validate_desktop_session", {
    p_token: token,
  });

  if (error || !data?.valid) return null;

  return {
    tenant_id: data.tenant_id as string,
    user_id: data.user_id as string,
    client_id: data.client_id as string,
  };
}

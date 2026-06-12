import { redirect } from "next/navigation";
import {
  deriveSessionFingerprint,
  twoFactorRedirectPath,
  type TwoFactorStatus,
} from "@/lib/auth/two-factor";
import { createClient } from "@/lib/supabase/server";

export async function ensureTwoFactorVerified(nextPath?: string): Promise<TwoFactorStatus> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect(`/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`);
  }

  const fingerprint = deriveSessionFingerprint(session.access_token);
  const { data, error } = await supabase.rpc("get_two_factor_status", {
    p_session_fingerprint: fingerprint,
  });

  if (error) {
    throw new Error(error.message);
  }

  const status = data as TwoFactorStatus;
  const gatePath = twoFactorRedirectPath(status, nextPath);
  if (gatePath) {
    redirect(gatePath);
  }

  return status;
}

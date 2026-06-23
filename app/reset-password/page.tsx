"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_REDIRECT_PATHS } from "@/lib/auth/auth-redirect-urls";

/** Legacy route — preserve Supabase recovery tokens in hash/query. */
export default function LegacyResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    const destination = `${AUTH_REDIRECT_PATHS.updatePassword}${window.location.search}${window.location.hash}`;
    router.replace(destination);
  }, [router]);

  return null;
}

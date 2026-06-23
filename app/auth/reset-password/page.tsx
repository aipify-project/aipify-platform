"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Preserve Supabase recovery hash/query when canonicalizing to update-password. */
export default function AuthResetPasswordRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const destination = `/auth/update-password${window.location.search}${window.location.hash}`;
    router.replace(destination);
  }, [router]);

  return null;
}

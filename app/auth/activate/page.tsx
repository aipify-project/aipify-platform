"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Partner first-time activation entry — preserves recovery tokens and
 * canonicalizes onto update-password with Seller panel success routing.
 */
export default function AuthActivateRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (!search.has("portal")) search.set("portal", "partner");
    const destination = `/auth/update-password?${search.toString()}${window.location.hash}`;
    router.replace(destination);
  }, [router]);

  return null;
}

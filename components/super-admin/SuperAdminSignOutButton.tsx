"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearAllPollingState } from "@/lib/polling";
import { invalidateTwoFactorStatusCache } from "@/lib/auth/two-factor";

type SuperAdminSignOutButtonProps = {
  label: string;
};

export default function SuperAdminSignOutButton({ label }: SuperAdminSignOutButtonProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    clearAllPollingState();
    invalidateTwoFactorStatusCache();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={signingOut}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 disabled:opacity-60"
    >
      {signingOut ? "…" : label}
    </button>
  );
}

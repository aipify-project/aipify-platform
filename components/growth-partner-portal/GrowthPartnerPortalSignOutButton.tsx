"use client";

import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { label: string };

export default function GrowthPartnerPortalSignOutButton({ label }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const supabase = getBrowserSupabaseClient();
        await supabase.auth.signOut();
        router.replace("/login");
      }}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      {label}
    </button>
  );
}

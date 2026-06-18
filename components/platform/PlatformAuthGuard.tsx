"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

type PlatformAuthGuardProps = {
  loadingLabel: string;
  children: ReactNode;
};

export default function PlatformAuthGuard({ loadingLabel, children }: PlatformAuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabaseClient();
    let mounted = true;

    async function verifyAccess() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !user) {
        router.replace("/login?next=/platform");
        return;
      }

      const profile = await getPlatformProfile(supabase);
      if (!mounted) return;

      if (!profile) {
        setDenied(true);
        setChecking(false);
        return;
      }

      setAuthorized(true);
      setChecking(false);
    }

    void verifyAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "SIGNED_OUT") {
        router.replace("/login?next=/platform");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-aipify-canvas">
        <AipifyLoader centered />
        <span className="sr-only">{loadingLabel}</span>
      </div>
    );
  }

  if (denied || !authorized) {
    return <AipifySystemNotice status="platform_required" />;
  }

  return children;
}

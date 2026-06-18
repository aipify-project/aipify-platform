"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

type SuperAdminAuthGuardProps = {
  loadingLabel: string;
  children: ReactNode;
};

export default function SuperAdminAuthGuard({ loadingLabel, children }: SuperAdminAuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

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
        router.replace("/login?next=/super");
        return;
      }

      const profile = await getPlatformProfile(supabase);
      if (!mounted) return;

      if (!profile || profile.role !== "super_admin") {
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
        router.replace("/login?next=/super");
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

  if (!authorized) {
    return <AipifySystemNotice status="super_admin_required" />;
  }

  return children;
}

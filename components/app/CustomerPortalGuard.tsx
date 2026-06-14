"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CustomerPortalGuardProps = {
  loadingLabel: string;
  children: ReactNode;
};

export default function CustomerPortalGuard({
  loadingLabel,
  children,
}: CustomerPortalGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login?next=/app");
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login?next=/app");
        setAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="text-sm font-medium text-gray-500">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return children;
}

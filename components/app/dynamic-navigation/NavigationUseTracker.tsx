"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Records module navigation use for personalization (recent / frequently used). */
export function NavigationUseTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname?.startsWith("/app")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const navKey = pathname.split("/").filter(Boolean).slice(1, 2)[0] ?? "dashboard";
    void fetch("/api/app/navigation/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "record_module_use",
        payload: { nav_key: navKey === "app" ? "dashboard" : navKey },
      }),
    });
  }, [pathname]);

  return null;
}

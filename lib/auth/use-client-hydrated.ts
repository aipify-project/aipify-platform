"use client";

import { useEffect, useState } from "react";

/** True after the client has mounted — use before reading sessionStorage or other browser-only state. */
export function useClientHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

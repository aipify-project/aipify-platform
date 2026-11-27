"use client";

import { useEffect } from "react";

/** Aligns the document language with the explicit page choice without a second navigation. */
export function SyncSalesLocale({ locale }: { locale: string }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}

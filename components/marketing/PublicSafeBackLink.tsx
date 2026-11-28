"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import {
  resolvePublicSafeBackHref,
  shouldUseHistoryBack,
} from "@/lib/marketing/public-safe-back";

type Props = {
  label: string;
  className?: string;
  /** Fallback when history/referrer is not safe — public Aipify home by default. */
  fallbackHref?: string;
};

/**
 * Localized Back control for general Aipify public pages.
 * Uses same-origin history when available; otherwise navigates to the public home.
 */
export default function PublicSafeBackLink({
  label,
  className,
  fallbackHref,
}: Props) {
  const href = resolvePublicSafeBackHref({ fallbackHref });

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (typeof window === "undefined") return;
    if (
      shouldUseHistoryBack({
        referrer: document.referrer,
        currentOrigin: window.location.origin,
        historyLength: window.history.length,
      })
    ) {
      event.preventDefault();
      window.history.back();
    }
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

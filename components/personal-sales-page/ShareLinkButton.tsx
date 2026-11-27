"use client";

import { useState } from "react";

export function ShareLinkButton({
  value,
  shareLabel,
  copiedLabel,
}: {
  value: string;
  shareLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#5538D3]"
      onClick={() => {
        const absolute = value.startsWith("http") ? value : `${window.location.origin}${value}`;
        const nav = navigator as Navigator & { share?: (data: { url: string }) => Promise<void> };
        if (typeof nav.share === "function") {
          void nav.share({ url: absolute }).catch(() => undefined);
          return;
        }
        void navigator.clipboard.writeText(absolute).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? copiedLabel : shareLabel}
    </button>
  );
}

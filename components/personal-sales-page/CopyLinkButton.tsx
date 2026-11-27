"use client";

import { useState } from "react";

export function CopyLinkButton({ value, copyLabel, copiedLabel }: { value: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#5538D3]"
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}

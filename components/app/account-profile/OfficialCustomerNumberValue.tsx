"use client";

import { useState } from "react";
import { ACCOUNT_PROFILE_READONLY_VALUE_CLASS } from "@/lib/app/account-profile/form-styles";

export function OfficialCustomerNumberValue({
  value,
  empty,
  copyLabel,
  copiedLabel,
}: {
  value: string | null;
  empty: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  if (!value) {
    return <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>{empty}</div>;
  }
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>{value}</div>
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
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import type { HumanApprovalReceiptLabels, HumanApprovalReceiptModel } from "@/lib/core/human-approval/types";
import { formatHumanApprovalReceiptPlainText } from "@/lib/core/human-approval/receipt";

type HumanApprovalReceiptProps = {
  model: HumanApprovalReceiptModel;
  labels: HumanApprovalReceiptLabels;
};

export function HumanApprovalReceipt({ model, labels }: HumanApprovalReceiptProps) {
  const [copied, setCopied] = useState(false);
  const plainText = formatHumanApprovalReceiptPlainText(model, labels);

  const copyReceipt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [plainText]);

  return (
    <section
      className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-emerald-900">{model.confirmationHeading}</h3>
        <button
          type="button"
          onClick={() => void copyReceipt()}
          className="rounded-md border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
          aria-label={labels.copy}
        >
          {copied ? labels.copied : labels.copy}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-emerald-100 bg-white p-3 font-mono text-xs text-gray-800">
        {plainText}
      </pre>
    </section>
  );
}

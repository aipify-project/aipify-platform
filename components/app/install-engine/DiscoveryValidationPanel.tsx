"use client";

import { HUMAN_VALIDATION_PROMPT } from "@/lib/install";

type DiscoveryValidationPanelProps = {
  installationId: string;
  prompt?: string;
  approveLabel: string;
  modifyLabel: string;
  rejectLabel: string;
  errorLabel: string;
  onComplete?: () => void;
};

/** Human validation step — approve, modify, or reject discovery findings (§9). */
export function DiscoveryValidationPanel({
  installationId,
  prompt = HUMAN_VALIDATION_PROMPT,
  approveLabel,
  modifyLabel,
  rejectLabel,
  errorLabel,
  onComplete,
}: DiscoveryValidationPanelProps) {
  async function submit(action: "approve" | "modify" | "reject") {
    const res = await fetch("/api/install/validate-discovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installation_id: installationId, action }),
    });
    if (!res.ok) {
      throw new Error(errorLabel);
    }
    onComplete?.();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-900">{prompt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          onClick={() => void submit("approve")}
        >
          {approveLabel}
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => void submit("modify")}
        >
          {modifyLabel}
        </button>
        <button
          type="button"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          onClick={() => void submit("reject")}
        >
          {rejectLabel}
        </button>
      </div>
    </div>
  );
}

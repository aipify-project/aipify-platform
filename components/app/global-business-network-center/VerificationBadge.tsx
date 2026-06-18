import type { VerificationStatus } from "@/lib/global-business-network-center/types";
import type { GlobalBusinessNetworkCenterLabels } from "@/lib/global-business-network-center/labels";
import { getVerificationLabel } from "@/lib/global-business-network-center/labels";

export function VerificationBadge({
  status,
  labels,
}: {
  status: VerificationStatus | string;
  labels: GlobalBusinessNetworkCenterLabels["verification"];
}) {
  const label = getVerificationLabel(status, labels);
  const tone =
    status === "verified" ? "bg-sky-50 text-sky-800 ring-sky-200"
    : status === "failed" ? "bg-rose-50 text-rose-800 ring-rose-200"
    : "bg-amber-50 text-amber-800 ring-amber-200";
  const symbol = status === "verified" ? "🛡️" : status === "failed" ? "❌" : "⚠️";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone}`}>
      <span aria-hidden>{symbol}</span>
      <span>{label}</span>
    </span>
  );
}

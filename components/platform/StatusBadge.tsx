type StatusBadgeProps = {
  status: string;
  label: string;
};

const TONE_MAP: Record<string, string> = {
  trial: "bg-amber-50 text-amber-800 ring-amber-100",
  trialing: "bg-amber-50 text-amber-800 ring-amber-100",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  connected: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  open: "bg-blue-50 text-blue-800 ring-blue-100",
  paused: "bg-gray-100 text-gray-700 ring-gray-200",
  pending: "bg-gray-100 text-gray-700 ring-gray-200",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
  revoked: "bg-red-50 text-red-800 ring-red-100",
  escalated: "bg-amber-50 text-amber-900 ring-amber-100",
  overdue: "bg-red-50 text-red-800 ring-red-100",
  past_due: "bg-red-50 text-red-800 ring-red-100",
  high: "bg-orange-50 text-orange-800 ring-orange-100",
  urgent: "bg-red-50 text-red-800 ring-red-100",
  low: "bg-slate-50 text-slate-700 ring-slate-200",
  normal: "bg-gray-100 text-gray-700 ring-gray-200",
  error: "bg-red-50 text-red-800 ring-red-100",
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  sent: "bg-blue-50 text-blue-800 ring-blue-100",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  company: "bg-violet-50 text-violet-800 ring-violet-100",
  private: "bg-indigo-50 text-indigo-800 ring-indigo-100",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const tone = TONE_MAP[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}
    >
      {label}
    </span>
  );
}

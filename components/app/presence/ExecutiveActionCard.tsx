import Link from "next/link";

type ExecutiveActionCardProps = {
  title: string;
  detail: string;
  actionLabel: string;
  href?: string;
  onAction?: () => void;
  tone?: "default" | "attention" | "positive";
};

const TONE_STYLES = {
  default: "border-gray-200 bg-white",
  attention: "border-amber-200 bg-amber-50/40",
  positive: "border-emerald-200 bg-emerald-50/40",
} as const;

export function ExecutiveActionCard({
  title,
  detail,
  actionLabel,
  href,
  onAction,
  tone = "default",
}: ExecutiveActionCardProps) {
  const actionClass =
    "inline-flex items-center gap-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900";

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${TONE_STYLES[tone]}`}
    >
      <h3 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h3>
      <p className="mt-3 flex-1 text-base leading-relaxed text-gray-600">{detail}</p>
      <div className="mt-6">
        {href ? (
          <Link href={href} className={actionClass}>
            {actionLabel}
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <button type="button" onClick={onAction} className={actionClass}>
            {actionLabel}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  );
}

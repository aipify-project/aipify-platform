import type { QuickActionKey } from "@/lib/platform/customer-workspace";

const ACTION_ICONS: Record<QuickActionKey, string> = {
  openSupport: "💬",
  pauseSubscription: "⏸",
  generateInvoice: "📄",
  resendWelcome: "✉️",
  runHealthScan: "🔍",
  scheduleOnboarding: "📅",
};

type CustomerQuickActionsProps = {
  title: string;
  labels: Record<QuickActionKey, string>;
};

export default function CustomerQuickActions({ title, labels }: CustomerQuickActionsProps) {
  const actions = Object.keys(labels) as QuickActionKey[];

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((key) => (
          <button
            key={key}
            type="button"
            className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-200 hover:shadow-md"
          >
            <span className="text-xl" aria-hidden="true">
              {ACTION_ICONS[key]}
            </span>
            <span className="text-sm font-semibold text-gray-800">{labels[key]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

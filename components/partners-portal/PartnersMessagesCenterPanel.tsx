import Link from "next/link";
import { Inbox, PauseCircle } from "lucide-react";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type { PartnersPortalMessagesLabels } from "@/lib/partners-portal/shell-labels";

type Props = { labels: PartnersPortalMessagesLabels };

/**
 * Partner inbox — fail-closed until Core messaging is enabled.
 * Never renders sample or other sellers' messages.
 */
export function PartnersMessagesCenterPanel({ labels }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-aipify-text">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-aipify-text-secondary">{labels.subtitle}</p>
      </div>

      <section className={`${AipifyShellClasses.surfaceCard} p-6 sm:p-8`} aria-labelledby="partners-messages-empty">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aipify-companion/10 text-aipify-companion">
            <Inbox className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
              <PauseCircle className="h-4 w-4" aria-hidden />
              <span>
                {labels.statusLabel}: {labels.statusNotActive}
              </span>
            </p>
            <h2 id="partners-messages-empty" className="text-lg font-semibold text-aipify-text">
              {labels.notReadyTitle}
            </h2>
            <p className="max-w-2xl text-sm text-aipify-text-secondary">{labels.notReadyBody}</p>
            <p className="max-w-2xl text-sm text-aipify-text-secondary">{labels.nextStep}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/partners/account/notifications"
                className="inline-flex min-h-[44px] items-center rounded-xl bg-aipify-companion px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
              >
                {labels.notificationsCta}
              </Link>
              <Link
                href="/partners"
                className="inline-flex min-h-[44px] items-center rounded-xl border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-semibold text-aipify-text hover:border-aipify-companion/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
              >
                {labels.homeCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

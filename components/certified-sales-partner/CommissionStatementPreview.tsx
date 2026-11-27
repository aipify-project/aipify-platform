import { formatEconomyMoney } from "@/lib/platform/economy-display";
import {
  buildSettlementDocument,
  type SettlementDocumentSource,
} from "@/lib/certified-sales-partner/settlement-document";
import type { SettlementStatementLabels } from "@/lib/certified-sales-partner/settlement-statement-labels";

export function CommissionStatementPreview({
  source,
  locale,
  labels,
  statusLabel,
  previewHref,
}: {
  source: SettlementDocumentSource;
  locale: string;
  labels: SettlementStatementLabels;
  statusLabel: string;
  previewHref: string;
}) {
  const model = buildSettlementDocument(source, locale);
  const money = formatEconomyMoney({ amount: model.totalAmount, currency: model.currency, locale });
  return (
    <article className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#7C3AED]">{labels.preview}</p>
          <h3 className="mt-1 text-xl font-semibold text-[color:var(--aipify-text-primary)]">{model.title}</h3>
        </div>
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.notIssued}</p>
      </div>
      <p className="mt-3 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.previewOnly}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.documentNumber}</dt>
          <dd className="text-sm font-medium">{labels.notIssued}</dd>
        </div>
        <div>
          <dt className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.issuer}</dt>
          <dd className="text-sm font-medium">
            {model.issuer.legalName}
            <span className="mt-1 block text-xs font-normal text-[color:var(--aipify-text-secondary)]">
              {model.issuer.organizationNumberDisplay} · {model.issuer.headquarters}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.period}</dt>
          <dd className="text-sm font-medium">{model.periodMonth ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.amount}</dt>
          <dd className="text-sm font-medium">{money.state === "value" ? money.text : "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.status}</dt>
          <dd className="text-sm font-medium">{statusLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.lines}</dt>
          <dd className="text-sm font-medium">{model.lineCount ?? "—"}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]">{labels.basis}. {labels.currencyNote}</p>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.taxPending}</p>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.recipientPending}</p>
      <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">
        {model.payment ? `${model.payment.paidAt} · ${model.payment.paymentReference}` : labels.paymentUnavailable}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={previewHref}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9]"
        >
          {labels.downloadPreview}
        </a>
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl border border-[color:var(--aipify-border)] px-4 py-2 text-sm font-semibold text-[color:var(--aipify-text-secondary)]"
          title={labels.issueBlocked}
        >
          {labels.generateDisabled}
        </button>
      </div>
      <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{labels.coreActivation}. {labels.issueBlocked}</p>
    </article>
  );
}

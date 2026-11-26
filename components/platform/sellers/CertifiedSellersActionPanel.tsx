"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { validateSettlementTransition } from "@/lib/certified-sales-partner/settlement-rules";
import type { CspSettlementStatus } from "@/lib/certified-sales-partner/constants";
import {
  ProductShopifyEditor,
  type ProductShopifyEditorLabels,
} from "@/components/platform/sellers/ProductShopifyEditor";

export type SellersActionOption = { value: string; label: string };

export type SellersActionLabels = {
  partnersTitle: string;
  settlementsTitle: string;
  productsTitle: string;
  partnersHint: string;
  settlementsHint: string;
  partnerId: string;
  partnerIdHint: string;
  status: string;
  reason: string;
  reasonHint: string;
  /** Business labels for partner decisions; `value` is the Core status code sent to the API. */
  partnerStatusOptions: SellersActionOption[];
  submitPartner: string;
  settlementId: string;
  settlementIdHint: string;
  fromStatus: string;
  toStatus: string;
  /** Business labels for settlement steps; `value` is the Core status code sent to the API. */
  settlementStatusOptions: SellersActionOption[];
  rejectionReason: string;
  rejectionReasonHint: string;
  paidAt: string;
  paymentReference: string;
  paidEvidenceHint: string;
  submitSettlement: string;
  productKey: string;
  productTitle: string;
  currency: string;
  fixedCommission: string;
  published: string;
  /** SALE channel checkbox label (canonical publish_sale). */
  publishSale?: string;
  /** APP channel checkbox label (publish_app). */
  publishApp?: string;
  publishAppHint?: string;
  /** When checked, save only channel flags (no commission upsert). */
  channelOnlyHint?: string;
  submitProduct: string;
  productTabProduct: string;
  productTabMedia: string;
  productTabLanguage: string;
  productTabAppPanel: string;
  productTabSalePanel: string;
  productTabPreview: string;
  /** @deprecated kept for older call sites — prefer app/sale panel copy */
  productTabPrice?: string;
  productTabCommission?: string;
  productTabPublish?: string;
  priceNotPublished: string;
  priceNotCommission: string;
  languageNotStored: string;
  percentUnavailable: string;
  publishMeaning: string;
  titlePersistenceNote: string;
  mediaBlocked: string;
  appPanelBlocked: string;
  previewNote: string;
  success: string;
  failClosed: string;
  error: string;
  /** Translated messages for known API error codes; unknown codes fall back to `error`. */
  errors: Record<string, string>;
};

type Section = "partners" | "settlements" | "products";

type Props = {
  section: Section;
  labels: SellersActionLabels;
  /** Prefill from a directory row. Re-mount (via `key`) to apply a new selection. */
  initialPartnerId?: string;
  initialPartnerStatus?: string;
  initialSettlementId?: string;
  initialFromStatus?: string;
  initialToStatus?: string;
  /** Prefill product editor from register row. Remount with `key` when selection changes. */
  selectedProductKey?: string | null;
  editorMode?: "create" | "edit";
  selectedTitle?: string | null;
  selectedCurrency?: string | null;
  selectedCommission?: number | null;
  selectedPublishSale?: boolean | null;
  selectedPublishApp?: boolean | null;
  selectedMasterActive?: boolean | null;
  selectedLogoSrc?: string | null;
  selectedCategory?: string | null;
  selectedProductType?: string | null;
  /** Shopify-layout editor labels (required when section=products). */
  editorLabels?: ProductShopifyEditorLabels;
  /** Standalone editor page — hide outer section chrome. */
  standaloneEditor?: boolean;
  /** Called after Core accepted the request so the surrounding list can reload. */
  onSuccess?: () => void;
};

export function CertifiedSellersActionPanel({
  section,
  labels,
  initialPartnerId,
  initialPartnerStatus,
  initialSettlementId,
  initialFromStatus,
  initialToStatus,
  selectedProductKey = null,
  editorMode = "create",
  selectedTitle = null,
  selectedCurrency = null,
  selectedCommission = null,
  selectedPublishSale = null,
  selectedPublishApp = null,
  selectedMasterActive = null,
  selectedLogoSrc = null,
  selectedCategory = null,
  selectedProductType = null,
  editorLabels,
  standaloneEditor = false,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<{ kind: "ok" | "closed" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  /** Known codes map to translated copy; raw codes are never shown. */
  function errorText(code?: string): string {
    return (code && labels.errors[code]) || labels.error;
  }

  type PostOutcome = "ok" | "closed" | "error";

  async function post(
    url: string,
    body: Record<string, unknown>,
    options?: { quiet?: boolean },
  ): Promise<PostOutcome> {
    if (!options?.quiet) {
      setPending(true);
      setMessage(null);
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        backend_ready?: boolean;
        message?: string;
      };
      if (res.status === 401 || res.status === 403 || data.error === "forbidden") {
        if (!options?.quiet) setMessage({ kind: "error", text: errorText("forbidden") });
        return "error";
      }
      if (res.status === 503 || data.backend_ready === false) {
        if (!options?.quiet) setMessage({ kind: "closed", text: labels.failClosed });
        return "closed";
      }
      if (!res.ok) {
        if (!options?.quiet) setMessage({ kind: "error", text: errorText(data.error) });
        return "error";
      }
      if (!options?.quiet) {
        setMessage({ kind: "ok", text: labels.success });
        onSuccess?.();
      }
      return "ok";
    } catch {
      if (!options?.quiet) setMessage({ kind: "error", text: labels.error });
      return "error";
    } finally {
      if (!options?.quiet) setPending(false);
    }
  }

  function onPartners(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = String(fd.get("reason") ?? "").trim();
    if (reason.length < 3) {
      setMessage({ kind: "error", text: errorText("reason_required") });
      return;
    }
    const status = String(fd.get("status") ?? "");
    void post("/api/platform/sellers/partners", {
      partner_id: String(fd.get("partner_id") ?? "").trim(),
      status,
      reason,
      // Action panel is an explicit operator form — require confirm for dual-identity approvals.
      ...(status === "approved" ? { confirm_active_app_customer: true } : {}),
    });
  }

  function onSettlements(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const from = String(fd.get("from_status") ?? "");
    const to = String(fd.get("to_status") ?? "");
    const rejectionReason = String(fd.get("rejection_reason") ?? "").trim();
    const paidAtRaw = String(fd.get("paid_at") ?? "").trim();
    const paymentReference = String(fd.get("payment_reference") ?? "").trim();
    // Early, friendly pre-check with the same pure rules the API enforces. The server re-validates
    // and supplies the admin identity, so "server" below is only a client-side placeholder.
    const check = validateSettlementTransition(from as CspSettlementStatus, to as CspSettlementStatus, {
      rejectionReason,
      paidAt: paidAtRaw,
      paymentReference,
      adminId: "server",
    });
    if (!check.ok) {
      setMessage({ kind: "error", text: errorText(check.error) });
      return;
    }
    void post("/api/platform/sellers/settlements", {
      settlement_id: String(fd.get("settlement_id") ?? "").trim(),
      from_status: from,
      to_status: to,
      rejection_reason: rejectionReason,
      paid_at: paidAtRaw ? new Date(paidAtRaw).toISOString() : "",
      payment_reference: paymentReference,
    });
  }

  async function onProducts(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const productKey = String(fd.get("product_key") ?? "").trim();
    const publishSale = fd.get("publish_sale") === "on" || fd.get("published") === "on";
    const publishAppChecked = fd.get("publish_app") === "on";
    const channelOnly = fd.get("channel_only") === "on";
    const masterActiveRaw = String(fd.get("master_active") ?? "");
    const masterActive =
      masterActiveRaw === "true" ? true : masterActiveRaw === "false" ? false : undefined;

    setPending(true);
    setMessage(null);
    try {
      if (channelOnly) {
        const channelOutcome = await post(
          "/api/platform/sellers/products/channels",
          {
            product_key: productKey,
            publish_app: publishAppChecked,
            publish_sale: publishSale,
            ...(masterActive === undefined ? {} : { master_active: masterActive }),
          },
          { quiet: true },
        );
        if (channelOutcome === "ok") {
          setMessage({ kind: "ok", text: labels.success });
          onSuccess?.();
          if (standaloneEditor && editorMode === "create") {
            router.replace(`/platform/sellers/products/${encodeURIComponent(productKey)}`);
          }
        } else if (channelOutcome === "closed") {
          setMessage({ kind: "closed", text: labels.failClosed });
        } else {
          setMessage({ kind: "error", text: labels.error });
        }
        return;
      }

      const productOutcome = await post(
        "/api/platform/sellers/products",
        {
          product_key: productKey,
          title: String(fd.get("title") ?? ""),
          currency: String(fd.get("currency") ?? "").toUpperCase(),
          fixed_commission_amount: Number(fd.get("fixed_commission_amount") ?? 0),
          publish_sale: publishSale,
          published: publishSale,
        },
        { quiet: true },
      );
      if (productOutcome !== "ok") {
        setMessage({
          kind: productOutcome === "closed" ? "closed" : "error",
          text: productOutcome === "closed" ? labels.failClosed : labels.error,
        });
        return;
      }

      const needsChannelWrite =
        publishAppChecked ||
        masterActive === false ||
        (masterActive === true && (publishAppChecked || publishSale));

      if (!needsChannelWrite) {
        setMessage({ kind: "ok", text: labels.success });
        onSuccess?.();
        if (standaloneEditor && editorMode === "create") {
          router.replace(`/platform/sellers/products/${encodeURIComponent(productKey)}`);
        }
        return;
      }

      const channelOutcome = await post(
        "/api/platform/sellers/products/channels",
        {
          product_key: productKey,
          ...(publishAppChecked ? { publish_app: true } : {}),
          ...(publishSale ? { publish_sale: true } : {}),
          ...(masterActive === undefined ? {} : { master_active: masterActive }),
        },
        { quiet: true },
      );
      if (channelOutcome === "ok") {
        setMessage({ kind: "ok", text: labels.success });
        onSuccess?.();
        if (standaloneEditor && editorMode === "create") {
          router.replace(`/platform/sellers/products/${encodeURIComponent(productKey)}`);
        }
        return;
      }
      if (channelOutcome === "closed") {
        setMessage({
          kind: "closed",
          text:
            publishAppChecked || masterActive === false
              ? (labels.publishAppHint ?? labels.failClosed)
              : labels.failClosed,
        });
        onSuccess?.();
        if (standaloneEditor && editorMode === "create") {
          router.replace(`/platform/sellers/products/${encodeURIComponent(productKey)}`);
        }
        return;
      }
      setMessage({ kind: "error", text: labels.error });
      onSuccess?.();
    } finally {
      setPending(false);
    }
  }

  const title =
    section === "partners"
      ? labels.partnersTitle
      : section === "settlements"
        ? labels.settlementsTitle
        : labels.productsTitle;

  if (section === "products" && editorLabels) {
    return (
      <div className={standaloneEditor ? "space-y-3" : "space-y-3"}>
        <ProductShopifyEditor
          labels={editorLabels}
          mode={editorMode}
          productKey={selectedProductKey}
          title={selectedTitle}
          currency={selectedCurrency}
          commission={selectedCommission}
          publishSale={selectedPublishSale}
          publishApp={selectedPublishApp}
          masterActive={selectedMasterActive}
          logoSrc={selectedLogoSrc}
          category={selectedCategory}
          productType={selectedProductType}
          pending={pending}
          onSubmit={onProducts}
          onDiscard={() => {
            if (standaloneEditor) router.push("/platform/sellers/products");
          }}
        />
        {message ? (
          <p className="text-sm text-[color:var(--aipify-text-secondary)]" role="status">
            {message.text}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{title}</h2>
      {section === "partners" ? (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onPartners}>
          <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.partnersHint}</p>
          <Field
            name="partner_id"
            label={labels.partnerId}
            hint={labels.partnerIdHint}
            required
            defaultValue={initialPartnerId}
          />
          <Select
            name="status"
            label={labels.status}
            options={labels.partnerStatusOptions}
            defaultValue={initialPartnerStatus}
          />
          <Field name="reason" label={labels.reason} hint={labels.reasonHint} required minLength={3} maxLength={500} />
          <Submit pending={pending} label={labels.submitPartner} />
        </form>
      ) : null}
      {section === "settlements" ? (
        <form className="mt-4 grid max-w-xl gap-3" onSubmit={onSettlements}>
          <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.settlementsHint}</p>
          <Field
            name="settlement_id"
            label={labels.settlementId}
            hint={labels.settlementIdHint}
            required
            defaultValue={initialSettlementId}
          />
          <Select
            name="from_status"
            label={labels.fromStatus}
            options={labels.settlementStatusOptions}
            defaultValue={initialFromStatus}
          />
          <Select
            name="to_status"
            label={labels.toStatus}
            options={labels.settlementStatusOptions}
            defaultIndex={1}
            defaultValue={initialToStatus}
          />
          <Field name="rejection_reason" label={labels.rejectionReason} hint={labels.rejectionReasonHint} />
          <Field name="paid_at" label={labels.paidAt} type="datetime-local" hint={labels.paidEvidenceHint} />
          <Field name="payment_reference" label={labels.paymentReference} />
          <Submit pending={pending} label={labels.submitSettlement} />
        </form>
      ) : null}
      {message ? (
        <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
          {message.text}
        </p>
      ) : null}
    </section>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  type = "text",
  maxLength,
  minLength,
  hint,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <label className="text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
      />
      {hint ? <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">{hint}</span> : null}
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultIndex = 0,
  defaultValue,
}: {
  name: string;
  label: string;
  options: SellersActionOption[];
  defaultIndex?: number;
  defaultValue?: string;
}) {
  const initial =
    defaultValue && options.some((o) => o.value === defaultValue) ? defaultValue : options[defaultIndex]?.value;
  return (
    <label className="text-sm">
      <span className="font-medium">{label}</span>
      <select
        name={name}
        defaultValue={initial}
        className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
        required
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {label}
    </button>
  );
}

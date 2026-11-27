"use client";

/**
 * Shopify-inspired product create/edit layout for Platform Product Center.
 * Left ~2/3: title, description, media, category, price.
 * Right ~1/3: status, publishing channels (APP + SALE PARTNER), organization.
 * Sticky save bar. Honest about Core persist limits (channel RPC / locale / media).
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { SellersActionLabels } from "@/components/platform/sellers/CertifiedSellersActionPanel";
import {
  ProductVariantBuilder,
  type ProductVariantBuilderLabels,
} from "@/components/platform/sellers/ProductVariantBuilder";
import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";
import { variantsForProduct } from "@/lib/product-catalog/merge";

export type ProductEditorMode = "create" | "edit";

export type ProductShopifyEditorLabels = SellersActionLabels & {
  backToProducts: string;
  createHeading: string;
  editHeading: string;
  unsaved: string;
  saved: string;
  discard: string;
  save: string;
  tagline: string;
  description: string;
  descriptionHint: string;
  mediaTitle: string;
  mediaUpload: string;
  mediaChooseExisting: string;
  category: string;
  priceCardTitle: string;
  statusCardTitle: string;
  statusActive: string;
  statusDraft: string;
  statusUnlisted: string;
  statusActiveHint: string;
  statusDraftHint: string;
  statusUnlistedHint: string;
  statusUnlistedBlocked: string;
  channelsCardTitle: string;
  channelApp: string;
  channelSale: string;
  channelSearch: string;
  organizationTitle: string;
  productType: string;
  advancedSku: string;
  languageTitle: string;
  languageHint: string;
  previewSecondary: string;
  channelAppDetails: string;
  channelSaleDetails: string;
  variantsTitle: string;
  variantBuilder: ProductVariantBuilderLabels;
};

const CONTENT_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
type ContentLocale = (typeof CONTENT_LOCALES)[number];

type MasterStatus = "active" | "draft" | "unlisted";

type LocaleDraft = {
  title: string;
  tagline: string;
  description: string;
};

const emptyLocale = (): LocaleDraft => ({ title: "", tagline: "", description: "" });

export function ProductShopifyEditor({
  labels,
  mode,
  productKey: initialKey,
  title: initialTitle,
  currency: initialCurrency,
  commission: initialCommission,
  publishSale: initialPublishSale,
  publishApp: initialPublishApp,
  masterActive: initialMasterActive,
  logoSrc,
  category,
  productType,
  pending,
  onSubmit,
  onDiscard,
  backHref = "/platform/sellers/products",
}: {
  labels: ProductShopifyEditorLabels;
  mode: ProductEditorMode;
  productKey: string | null;
  title: string | null;
  currency: string | null;
  commission: number | null;
  publishSale: boolean | null;
  publishApp: boolean | null;
  /** null = unknown / not returned from Core yet */
  masterActive?: boolean | null;
  logoSrc?: string | null;
  category?: string | null;
  productType?: string | null;
  pending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDiscard?: () => void;
  backHref?: string;
}) {
  const [productKey, setProductKey] = useState(initialKey ?? "");
  const [currency, setCurrency] = useState(initialCurrency ?? "NOK");
  const [commission, setCommission] = useState(
    initialCommission != null && Number.isFinite(initialCommission)
      ? String(initialCommission)
      : "",
  );
  const [publishApp, setPublishApp] = useState(initialPublishApp === true);
  const [publishSale, setPublishSale] = useState(initialPublishSale === true);
  const [masterStatus, setMasterStatus] = useState<MasterStatus>(() => {
    if (initialMasterActive === false) return "unlisted";
    if (initialPublishSale === true || initialPublishApp === true) return "active";
    return "draft";
  });
  const [contentLocale, setContentLocale] = useState<ContentLocale>("no");
  const [localeDrafts, setLocaleDrafts] = useState<Record<ContentLocale, LocaleDraft>>(() => {
    const base = Object.fromEntries(
      CONTENT_LOCALES.map((code) => [code, emptyLocale()]),
    ) as Record<ContentLocale, LocaleDraft>;
    base.no = {
      title: initialTitle ?? "",
      tagline: "",
      description: "",
    };
    return base;
  });
  const [channelQuery, setChannelQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(true);
  const [appDetailsOpen, setAppDetailsOpen] = useState(false);
  const [variants, setVariants] = useState<ProductVariantDefinition[]>(() =>
    initialKey ? variantsForProduct(initialKey) : [],
  );

  const markDirty = useCallback(() => setDirty(true), []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const draft = localeDrafts[contentLocale];

  function patchLocale(partial: Partial<LocaleDraft>) {
    setLocaleDrafts((prev) => ({
      ...prev,
      [contentLocale]: { ...prev[contentLocale], ...partial },
    }));
    markDirty();
  }

  const channelOptions = useMemo(() => {
    const all = [
      { id: "app" as const, label: labels.channelApp, on: publishApp, set: setPublishApp },
      { id: "sale" as const, label: labels.channelSale, on: publishSale, set: setPublishSale },
    ];
    const q = channelQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter((item) => item.label.toLowerCase().includes(q));
  }, [channelQuery, labels.channelApp, labels.channelSale, publishApp, publishSale]);

  const heading = mode === "edit" ? labels.editHeading : labels.createHeading;
  const displayName = draft.title.trim() || productKey || labels.productTitle;

  const statusHint =
    masterStatus === "active"
      ? labels.statusActiveHint
      : masterStatus === "unlisted"
        ? labels.statusUnlistedHint
        : labels.statusDraftHint;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        // Sync controlled fields into native FormData names before parent handler runs.
        onSubmit(event);
      }}
      onChange={markDirty}
    >
      <input type="hidden" name="product_key" value={productKey} />
      <input type="hidden" name="title" value={localeDrafts.no.title || draft.title} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="fixed_commission_amount" value={commission} />
      <input type="hidden" name="publish_sale" value={publishSale ? "on" : ""} />
      <input type="hidden" name="publish_app" value={publishApp ? "on" : ""} />
      <input
        type="hidden"
        name="master_active"
        value={masterStatus === "unlisted" ? "false" : "true"}
      />
      <input
        type="hidden"
        name="published"
        value={masterStatus === "active" && publishSale ? "on" : ""}
      />

      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-2 rounded-2xl border border-[color:var(--aipify-border)] bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
        <Link
          href={backHref}
          className="text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
          onClick={(event) => {
            if (dirty && !window.confirm(labels.unsaved)) {
              event.preventDefault();
            }
          }}
        >
          ← {labels.backToProducts}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[color:var(--aipify-text-primary)]">
            {heading}
            {mode === "edit" ? (
              <span className="ml-2 font-normal text-[color:var(--aipify-text-secondary)]">
                {displayName}
              </span>
            ) : null}
          </p>
          <p className="text-xs text-[color:var(--aipify-text-secondary)]">
            {dirty ? labels.unsaved : labels.saved}
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-text-secondary)]"
          onClick={() => {
            if (dirty && !window.confirm(labels.unsaved)) return;
            setDirty(false);
            onDiscard?.();
          }}
        >
          {labels.discard}
        </button>
        <button
          type="button"
          className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-text-secondary)]"
          onClick={() => {
            /* Preview is secondary — no fake storefront. */
          }}
        >
          {labels.previewSecondary}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {labels.save}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div className="space-y-4">
          <EditorCard title={labels.productTabProduct}>
            <label className="block text-sm">
              <span className="font-medium">{labels.productTitle}</span>
              <input
                value={draft.title}
                onChange={(event) => patchLocale({ title: event.target.value })}
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                required={contentLocale === "no"}
              />
              <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                {labels.titlePersistenceNote}
              </span>
            </label>
            <label className="mt-3 block text-sm">
              <span className="font-medium">{labels.tagline}</span>
              <input
                value={draft.tagline}
                onChange={(event) => patchLocale({ tagline: event.target.value })}
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
              />
              <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                {labels.languageHint}
              </span>
            </label>
          </EditorCard>

          <EditorCard title={labels.description}>
            <textarea
              value={draft.description}
              onChange={(event) => patchLocale({ description: event.target.value })}
              rows={10}
              className="w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
              placeholder={labels.descriptionHint}
            />
            <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
              {labels.languageNotStored}
            </p>
          </EditorCard>

          <EditorCard title={labels.mediaTitle}>
            <div className="flex flex-wrap items-center gap-3">
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- registry brand mark
                <img src={logoSrc} alt="" className="h-16 w-16 rounded-xl object-contain" />
              ) : (
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[color:var(--aipify-accent-soft)] text-lg font-semibold text-[color:var(--aipify-companion-purple)]">
                  {(draft.title || productKey || "?").slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold opacity-60"
                >
                  {labels.mediaUpload}
                </button>
                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold opacity-60"
                >
                  {labels.mediaChooseExisting}
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.mediaBlocked}</p>
          </EditorCard>

          <EditorCard title={labels.category}>
            <p className="text-sm text-[color:var(--aipify-text-primary)]">
              {category || productType || "—"}
            </p>
          </EditorCard>

          <EditorCard title={labels.variantsTitle || labels.priceCardTitle}>
            <ProductVariantBuilder
              productKey={productKey}
              variants={variants}
              labels={labels.variantBuilder}
              onChange={(next) => {
                setVariants(next);
                markDirty();
              }}
            />
            <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{labels.priceNotPublished}</p>
            <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.priceNotCommission}
            </p>
          </EditorCard>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <EditorCard title={labels.statusCardTitle}>
            <div className="space-y-2">
              {(
                [
                  ["active", labels.statusActive, labels.statusActiveHint],
                  ["draft", labels.statusDraft, labels.statusDraftHint],
                  ["unlisted", labels.statusUnlisted, labels.statusUnlistedHint],
                ] as const
              ).map(([value, label, hint]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer gap-2 rounded-xl border px-3 py-2 text-sm ${
                    masterStatus === value
                      ? "border-[color:var(--aipify-companion-purple)] bg-[color:var(--aipify-accent-soft)]"
                      : "border-[color:var(--aipify-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="master_status_ui"
                    checked={masterStatus === value}
                    onChange={() => {
                      setMasterStatus(value);
                      markDirty();
                    }}
                  />
                  <span>
                    <span className="font-semibold text-[color:var(--aipify-text-primary)]">{label}</span>
                    <span className="mt-0.5 block text-xs text-[color:var(--aipify-text-secondary)]">
                      {hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">{statusHint}</p>
            <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">
              {labels.statusUnlistedBlocked}
            </p>
          </EditorCard>

          <EditorCard title={labels.channelsCardTitle}>
            <input
              type="search"
              value={channelQuery}
              onChange={(event) => setChannelQuery(event.target.value)}
              placeholder={labels.channelSearch}
              className="mb-3 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
            />
            <div className="space-y-2">
              {channelOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={option.on}
                    onChange={(event) => {
                      option.set(event.target.checked);
                      markDirty();
                    }}
                  />
                  <span className="font-semibold">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {publishApp ? (
                <span className="rounded-full bg-[color:var(--aipify-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[color:var(--aipify-companion-purple)]">
                  {labels.channelApp}
                </span>
              ) : null}
              {publishSale ? (
                <span className="rounded-full bg-[color:var(--aipify-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[color:var(--aipify-companion-purple)]">
                  {labels.channelSale}
                </span>
              ) : null}
            </div>

            {publishApp ? (
              <details
                className="mt-3 rounded-xl border border-[color:var(--aipify-border)] p-3"
                open={appDetailsOpen}
                onToggle={(event) => setAppDetailsOpen((event.target as HTMLDetailsElement).open)}
              >
                <summary className="cursor-pointer text-sm font-semibold">{labels.channelAppDetails}</summary>
                <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">
                  {labels.publishAppHint ?? labels.appPanelBlocked}
                </p>
              </details>
            ) : null}

            {publishSale ? (
              <details
                className="mt-3 rounded-xl border border-[color:var(--aipify-border)] p-3"
                open={saleDetailsOpen}
                onToggle={(event) => setSaleDetailsOpen((event.target as HTMLDetailsElement).open)}
              >
                <summary className="cursor-pointer text-sm font-semibold">{labels.channelSaleDetails}</summary>
                <div className="mt-3 grid gap-3">
                  <p className="text-sm text-[color:var(--aipify-text-secondary)]">
                    {labels.percentUnavailable}
                  </p>
                  <label className="text-sm">
                    <span className="font-medium">{labels.currency}</span>
                    <input
                      value={currency}
                      maxLength={3}
                      onChange={(event) => {
                        setCurrency(event.target.value.toUpperCase());
                        markDirty();
                      }}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="font-medium">{labels.fixedCommission}</span>
                    <input
                      type="number"
                      value={commission}
                      onChange={(event) => {
                        setCommission(event.target.value);
                        markDirty();
                      }}
                      className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
                    />
                  </label>
                  <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.publishMeaning}</p>
                </div>
              </details>
            ) : null}
          </EditorCard>

          <EditorCard title={labels.organizationTitle}>
            <label className="block text-sm">
              <span className="font-medium">{labels.advancedSku}</span>
              <input
                value={productKey}
                onChange={(event) => {
                  setProductKey(event.target.value.trim().toLowerCase());
                  markDirty();
                }}
                required
                disabled={mode === "edit"}
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 font-mono text-sm disabled:opacity-70"
              />
              <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                {labels.productKey}
              </span>
            </label>
            <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">
              <span className="font-medium text-[color:var(--aipify-text-primary)]">
                {labels.productType}:{" "}
              </span>
              {productType || category || "—"}
            </p>
          </EditorCard>

          <EditorCard title={labels.languageTitle}>
            <label className="block text-sm">
              <span className="font-medium">{labels.languageTitle}</span>
              <select
                value={contentLocale}
                onChange={(event) => setContentLocale(event.target.value as ContentLocale)}
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
              >
                {CONTENT_LOCALES.map((code) => (
                  <option key={code} value={code}>
                    {code.toUpperCase()}
                    {localeDrafts[code].title.trim() ? " · ✓" : ""}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">{labels.languageHint}</p>
          </EditorCard>
        </div>
      </div>
    </form>
  );
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

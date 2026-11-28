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
import {
  buildEditorPublicationReport,
  ProductPublicationReadinessPanel,
  type ProductPublicationReadinessLabels,
} from "@/components/platform/sellers/ProductPublicationReadinessPanel";
import type { UnifiedCatalogProduct } from "@/lib/product-catalog";
import type { ProductVariantDefinition } from "@/lib/product-catalog/variants";
import { variantHasPaidCustomerPrice } from "@/lib/product-catalog/quota-labels";
import { canPersistVariantCommissionRules } from "@/lib/product-catalog/variant-commission";
import { resolveProductModuleBinding } from "@/lib/product-catalog/module-binding";
import {
  PRODUCT_TAXONOMY_CATEGORY_OPTIONS,
  PRODUCT_TAXONOMY_TYPES,
  taxonomyShowsDependencyPicker,
  type ProductTaxonomyType,
} from "@/lib/product-catalog/product-taxonomy";

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
  moduleBinding: string;
  moduleReady: string;
  moduleNotReady: string;
  languageTitle: string;
  languageHint: string;
  previewSecondary: string;
  channelAppDetails: string;
  channelSaleDetails: string;
  variantsTitle: string;
  variantBuilder: ProductVariantBuilderLabels;
  /** Shown after Core product save when Staging persist is unavailable. */
  variantCommissionNotSaved: string;
  /** Shown after successful Staging Core variant/commission persist. */
  variantCommissionSaved: string;
  /** Shown when variant persist fails — never claim success. */
  variantCommissionSaveFailed: string;
  legacyProductCommissionHint: string;
  taxonomyTitle: string;
  taxonomyUnconfigured: string;
  taxonomyTypeUnset: string;
  taxonomyTypePrimary: string;
  taxonomyTypeAddon: string;
  taxonomyTypeVoice: string;
  taxonomyTypeSalesGrowth: string;
  taxonomyTypeOther: string;
  taxonomyCategoryHint: string;
  taxonomyDependsOn: string;
  taxonomyDependsOnHint: string;
  taxonomyAllSemantics: string;
  taxonomyLoadFailed: string;
  taxonomySaved: string;
  taxonomySaveFailed: string;
  taxonomyPartialSave: string;
  publicationReadiness: ProductPublicationReadinessLabels;
  /** Locale Core persistence */
  contentBenefits?: string;
  contentSaveDraft?: string;
  contentApprove?: string;
  contentReload?: string;
  contentSavedDraft?: string;
  contentSavedApproved?: string;
  contentSaveFailed?: string;
  contentMissingHint?: string;
  contentStatusDraft?: string;
  contentStatusApproved?: string;
  /** Media upload (fail-closed until Staging activation) */
  mediaUploadActivationRequired?: string;
  mediaUploadFailed?: string;
  mediaCommitFailed?: string;
  mediaRegistered?: string;
  mediaHero?: string;
  mediaLogo?: string;
};

const CONTENT_LOCALES = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
type ContentLocale = (typeof CONTENT_LOCALES)[number];

type MasterStatus = "active" | "draft" | "unlisted";

type LocaleDraft = {
  title: string;
  tagline: string;
  description: string;
  benefits: string;
  approved: boolean;
  fromCore: boolean;
};

const emptyLocale = (): LocaleDraft => ({
  title: "",
  tagline: "",
  description: "",
  benefits: "",
  approved: false,
  fromCore: false,
});

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
  heroImagePath = null,
  category: _legacyCategory,
  productType: _legacyProductType,
  dependencyCandidates = [],
  catalogProduct = null,
  coreProductId = null,
  channelSchemaAvailable = true,
  titleFromCore = null,
  previewLocale = "en",
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
  heroImagePath?: string | null;
  category?: string | null;
  productType?: string | null;
  /** Other Core product keys available as dependency targets (same register). */
  dependencyCandidates?: string[];
  /** Unified catalog row for honest APP/SALE preview cards. */
  catalogProduct?: UnifiedCatalogProduct | null;
  coreProductId?: string | null;
  channelSchemaAvailable?: boolean;
  titleFromCore?: string | null;
  previewLocale?: string;
  pending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDiscard?: () => void;
  backHref?: string;
}) {
  void _legacyCategory;
  void _legacyProductType;
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
      ...emptyLocale(),
      title: initialTitle ?? "",
    };
    return base;
  });
  const [localeBusy, setLocaleBusy] = useState(false);
  const [localeMessage, setLocaleMessage] = useState<string | null>(null);
  const [localeLoadError, setLocaleLoadError] = useState<string | null>(null);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [mediaMessage, setMediaMessage] = useState<string | null>(null);
  const [localLogoPreview, setLocalLogoPreview] = useState<string | null>(null);
  const [localHeroPreview, setLocalHeroPreview] = useState<string | null>(null);
  const [channelQuery, setChannelQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(true);
  const [appDetailsOpen, setAppDetailsOpen] = useState(false);
  const [variants, setVariants] = useState<ProductVariantDefinition[]>([]);
  const [variantsLoadError, setVariantsLoadError] = useState<string | null>(null);
  const canPersistVariants = canPersistVariantCommissionRules();
  const [taxonomyType, setTaxonomyType] = useState<ProductTaxonomyType | "">("");
  const [taxonomyCategoryId, setTaxonomyCategoryId] = useState("");
  const [taxonomyDependsOn, setTaxonomyDependsOn] = useState<string[]>([]);
  const [taxonomyUnconfigured, setTaxonomyUnconfigured] = useState(true);
  const [taxonomyLoadError, setTaxonomyLoadError] = useState<string | null>(null);
  const [taxonomyDirty, setTaxonomyDirty] = useState(false);

  const markDirty = useCallback(() => setDirty(true), []);
  const markTaxonomyDirty = useCallback(() => {
    setTaxonomyDirty(true);
    setDirty(true);
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!canPersistVariants || mode !== "edit" || !initialKey) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/platform/sellers/products/variants?product_key=${encodeURIComponent(initialKey)}`,
          { cache: "no-store" },
        );
        const body = (await res.json().catch(() => null)) as {
          found?: boolean;
          variants?: ProductVariantDefinition[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!res.ok || !body?.found) {
          setVariantsLoadError(labels.variantCommissionSaveFailed);
          return;
        }
        setVariants(Array.isArray(body.variants) ? body.variants : []);
        setVariantsLoadError(null);
      } catch {
        if (!cancelled) setVariantsLoadError(labels.variantCommissionSaveFailed);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [canPersistVariants, initialKey, labels.variantCommissionSaveFailed, mode]);

  useEffect(() => {
    if (mode !== "edit" || !initialKey) {
      setTaxonomyType("");
      setTaxonomyCategoryId("");
      setTaxonomyDependsOn([]);
      setTaxonomyUnconfigured(true);
      setTaxonomyLoadError(null);
      setTaxonomyDirty(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/platform/sellers/products/taxonomy?product_key=${encodeURIComponent(initialKey)}`,
          { cache: "no-store" },
        );
        const body = (await res.json().catch(() => null)) as {
          found?: boolean;
          taxonomy?: {
            productType?: string | null;
            categoryId?: string | null;
            dependsOnProductKeys?: string[];
            unconfigured?: boolean;
          };
        } | null;
        if (cancelled) return;
        if (!res.ok || !body?.found || !body.taxonomy) {
          setTaxonomyLoadError(labels.taxonomyLoadFailed);
          setTaxonomyUnconfigured(true);
          return;
        }
        const type = body.taxonomy.productType;
        setTaxonomyType(
          type && (PRODUCT_TAXONOMY_TYPES as readonly string[]).includes(type)
            ? (type as ProductTaxonomyType)
            : "",
        );
        setTaxonomyCategoryId(body.taxonomy.categoryId ?? "");
        setTaxonomyDependsOn(
          Array.isArray(body.taxonomy.dependsOnProductKeys)
            ? body.taxonomy.dependsOnProductKeys
            : [],
        );
        setTaxonomyUnconfigured(body.taxonomy.unconfigured !== false);
        setTaxonomyLoadError(null);
        setTaxonomyDirty(false);
      } catch {
        if (!cancelled) {
          setTaxonomyLoadError(labels.taxonomyLoadFailed);
          setTaxonomyUnconfigured(true);
          setTaxonomyDirty(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialKey, labels.taxonomyLoadFailed, mode]);

  const reloadLocalesFromCore = useCallback(async () => {
    if (mode !== "edit" || !initialKey) return;
    setLocaleBusy(true);
    setLocaleLoadError(null);
    try {
      const res = await fetch(
        `/api/platform/sellers/products/locale?product_key=${encodeURIComponent(initialKey)}`,
        { cache: "no-store" },
      );
      const body = (await res.json().catch(() => null)) as {
        found?: boolean;
        locales?: Array<{
          locale?: string;
          title?: string;
          tagline?: string | null;
          description?: string;
          benefits?: string[];
          approved?: boolean;
        }>;
        missing_locales?: string[];
        error?: string;
      } | null;
      if (!res.ok || !body?.found) {
        setLocaleLoadError(labels.contentSaveFailed || labels.error);
        return;
      }
      setLocaleDrafts((prev) => {
        const next = { ...prev };
        for (const code of CONTENT_LOCALES) {
          const row = (body.locales ?? []).find((item) => item.locale === code);
          if (!row) {
            next[code] = {
              ...emptyLocale(),
              title: code === "no" ? initialTitle ?? prev.no.title : "",
            };
            continue;
          }
          next[code] = {
            title: row.title ?? "",
            tagline: row.tagline ?? "",
            description: row.description ?? "",
            benefits: Array.isArray(row.benefits) ? row.benefits.join("\n") : "",
            approved: row.approved === true,
            fromCore: true,
          };
        }
        return next;
      });
      setLocaleMessage(null);
    } catch {
      setLocaleLoadError(labels.contentSaveFailed || labels.error);
    } finally {
      setLocaleBusy(false);
    }
  }, [initialKey, initialTitle, labels.contentSaveFailed, labels.error, mode]);

  useEffect(() => {
    if (mode !== "edit" || !initialKey) return;
    void reloadLocalesFromCore();
  }, [initialKey, mode, reloadLocalesFromCore]);

  const draft = localeDrafts[contentLocale];

  function patchLocale(partial: Partial<LocaleDraft>) {
    setLocaleDrafts((prev) => ({
      ...prev,
      [contentLocale]: { ...prev[contentLocale], ...partial, fromCore: false },
    }));
    markDirty();
  }

  async function saveLocaleContent(approved: boolean) {
    const key = (mode === "edit" ? initialKey : productKey)?.trim().toLowerCase();
    if (!key) return;
    const current = localeDrafts[contentLocale];
    if (!current.title.trim() || !current.description.trim()) {
      setLocaleMessage(labels.contentSaveFailed || labels.error);
      return;
    }
    setLocaleBusy(true);
    setLocaleMessage(null);
    try {
      const res = await fetch("/api/platform/sellers/products/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_key: key,
          locale: contentLocale,
          title: current.title.trim(),
          tagline: current.tagline.trim() || null,
          description: current.description.trim(),
          benefits: current.benefits
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 12),
          approved,
        }),
      });
      const body = (await res.json().catch(() => null)) as { found?: boolean; error?: string } | null;
      if (!res.ok || !body?.found) {
        setLocaleMessage(labels.contentSaveFailed || labels.error);
        return;
      }
      setLocaleDrafts((prev) => ({
        ...prev,
        [contentLocale]: { ...prev[contentLocale], approved, fromCore: true },
      }));
      setLocaleMessage(
        approved
          ? labels.contentSavedApproved || labels.saved
          : labels.contentSavedDraft || labels.saved,
      );
      setDirty(false);
    } catch {
      setLocaleMessage(labels.contentSaveFailed || labels.error);
    } finally {
      setLocaleBusy(false);
    }
  }

  async function uploadProductMedia(kind: "logo" | "hero", file: File) {
    const key = (mode === "edit" ? initialKey : productKey)?.trim().toLowerCase();
    if (!key) return;
    setMediaBusy(true);
    setMediaMessage(null);
    const previewUrl = URL.createObjectURL(file);
    if (kind === "logo") setLocalLogoPreview(previewUrl);
    else setLocalHeroPreview(previewUrl);
    try {
      const form = new FormData();
      form.set("product_key", key);
      form.set("kind", kind);
      form.set("file", file);
      const uploadRes = await fetch("/api/platform/sellers/products/media/upload", {
        method: "POST",
        body: form,
      });
      const uploadBody = (await uploadRes.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        path?: string;
        gate?: string;
      } | null;
      if (!uploadRes.ok || !uploadBody?.ok || !uploadBody.path) {
        setMediaMessage(
          uploadBody?.error === "upload_activation_required"
            ? labels.mediaUploadActivationRequired || labels.mediaBlocked
            : labels.mediaUploadFailed || labels.error,
        );
        return;
      }
      const commitRes = await fetch("/api/platform/sellers/products/media/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_key: key, kind, path: uploadBody.path }),
      });
      const commitBody = (await commitRes.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!commitRes.ok || !commitBody?.ok) {
        setMediaMessage(labels.mediaCommitFailed || labels.error);
        return;
      }
      setMediaMessage(labels.mediaRegistered || labels.saved);
    } catch {
      setMediaMessage(labels.mediaUploadFailed || labels.error);
    } finally {
      setMediaBusy(false);
    }
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

  const readinessReport = useMemo(() => {
    const key = productKey.trim().toLowerCase();
    if (!key) return null;
    const commissionAmount = Number(commission);
    const variantsSource =
      canPersistVariants && variants.length > 0
        ? ("core" as const)
        : variants.length > 0 || key === "kompis_web"
          ? ("planned" as const)
          : ("empty" as const);
    return buildEditorPublicationReport({
      productKey: key,
      coreProductId: coreProductId ?? (mode === "edit" ? catalogProduct?.coreProductId ?? null : null),
      channelSchemaAvailable,
      publishApp,
      publishSale,
      masterActive:
        masterStatus === "unlisted" ? false : masterStatus === "active" ? true : initialMasterActive ?? null,
      titleFromCore,
      productType: taxonomyType || null,
      categoryId: taxonomyCategoryId || null,
      dependsOnProductKeys: taxonomyDependsOn,
      registryLogoSrc: logoSrc ?? catalogProduct?.logoSrc ?? null,
      registryHeroSrc: heroImagePath ?? catalogProduct?.heroImagePath ?? null,
      variantsSource,
      variants: variants.map((v) => ({
        variantKey: v.variantKey,
        monthlyAmount: v.monthlyPrice?.amountMajor ?? null,
        yearlyAmount: v.yearlyPrice?.amountMajor ?? null,
        oneTimeAmount: v.oneTimePrice?.amountMajor ?? null,
        hasPaidCustomerPrice: variantHasPaidCustomerPrice(v),
      })),
      fixedCommissionAmount: Number.isFinite(commissionAmount) ? commissionAmount : null,
      currency: currency.trim() || null,
    });
  }, [
    canPersistVariants,
    catalogProduct?.coreProductId,
    catalogProduct?.heroImagePath,
    catalogProduct?.logoSrc,
    channelSchemaAvailable,
    commission,
    coreProductId,
    currency,
    heroImagePath,
    initialMasterActive,
    logoSrc,
    masterStatus,
    mode,
    productKey,
    publishApp,
    publishSale,
    taxonomyCategoryId,
    taxonomyDependsOn,
    taxonomyType,
    titleFromCore,
    variants,
  ]);

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
      <input type="hidden" name="product_type" value={taxonomyType} />
      <input type="hidden" name="category_id" value={taxonomyCategoryId} />
      <input type="hidden" name="depends_on_product_keys" value={JSON.stringify(taxonomyDependsOn)} />
      <input type="hidden" name="taxonomy_dirty" value={taxonomyDirty ? "on" : ""} />
      <input
        type="hidden"
        name="taxonomy_load_failed"
        value={taxonomyLoadError ? "on" : ""}
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
        <a
          href="#product-publication-readiness"
          className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold text-[color:var(--aipify-text-secondary)]"
        >
          {labels.previewSecondary}
        </a>
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
            <label className="mt-3 block text-sm">
              <span className="font-medium">{labels.contentBenefits}</span>
              <textarea
                value={draft.benefits}
                onChange={(event) => patchLocale({ benefits: event.target.value })}
                rows={4}
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm"
                placeholder={labels.contentBenefits}
              />
            </label>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={localeBusy || mode === "create"}
                onClick={() => void saveLocaleContent(false)}
                className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {labels.contentSaveDraft || labels.save}
              </button>
              <button
                type="button"
                disabled={localeBusy || mode === "create"}
                onClick={() => void saveLocaleContent(true)}
                className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {labels.contentApprove || labels.save}
              </button>
              <button
                type="button"
                disabled={localeBusy || mode === "create"}
                onClick={() => void reloadLocalesFromCore()}
                className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {labels.contentReload || labels.discard}
              </button>
              <span className="text-xs text-[color:var(--aipify-text-secondary)]">
                {draft.fromCore
                  ? draft.approved
                    ? labels.contentStatusApproved
                    : labels.contentStatusDraft
                  : labels.contentMissingHint || labels.languageNotStored}
              </span>
            </div>
            {localeLoadError ? (
              <p className="mt-2 text-sm text-red-700" role="alert">
                {localeLoadError}
              </p>
            ) : null}
            {localeMessage ? (
              <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{localeMessage}</p>
            ) : null}
            <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
              {labels.contentMissingHint || labels.languageNotStored}
            </p>
          </EditorCard>

          <EditorCard title={labels.mediaTitle}>
            <div className="flex flex-wrap items-center gap-3">
              {localLogoPreview || logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- registry or local preview
                <img
                  src={localLogoPreview || logoSrc || undefined}
                  alt=""
                  className="h-16 w-16 rounded-xl object-contain"
                />
              ) : (
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-[color:var(--aipify-accent-soft)] text-lg font-semibold text-[color:var(--aipify-companion-purple)]">
                  {(draft.title || productKey || "?").slice(0, 1).toUpperCase()}
                </span>
              )}
              {localHeroPreview || heroImagePath ? (
                // eslint-disable-next-line @next/next/no-img-element -- registry or local preview
                <img
                  src={localHeroPreview || heroImagePath || undefined}
                  alt=""
                  className="h-16 max-w-[8rem] rounded-xl object-cover"
                />
              ) : null}
              <div className="flex flex-wrap gap-2">
                <label className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold cursor-pointer">
                  {labels.mediaLogo || labels.mediaUpload}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={mediaBusy || mode === "create"}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) void uploadProductMedia("logo", file);
                    }}
                  />
                </label>
                <label className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 text-sm font-semibold cursor-pointer">
                  {labels.mediaHero || labels.mediaUpload}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={mediaBusy || mode === "create"}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) void uploadProductMedia("hero", file);
                    }}
                  />
                </label>
              </div>
            </div>
            {mediaMessage ? (
              <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{mediaMessage}</p>
            ) : (
              <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">
                {labels.mediaUploadActivationRequired || labels.mediaBlocked}
              </p>
            )}
          </EditorCard>

          <EditorCard title={labels.taxonomyTitle || labels.category}>
            {taxonomyUnconfigured ? (
              <p className="mb-3 text-sm text-[color:var(--aipify-text-secondary)]">
                {labels.taxonomyUnconfigured}
              </p>
            ) : null}
            {taxonomyLoadError ? (
              <p className="mb-3 text-sm text-red-700" role="alert">
                {taxonomyLoadError}
              </p>
            ) : null}
            <label className="block text-sm font-semibold text-[color:var(--aipify-text-primary)]">
              {labels.productType}
              <select
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm"
                value={taxonomyType}
                onChange={(event) => {
                  const next = event.target.value as ProductTaxonomyType | "";
                  setTaxonomyType(next);
                  if (next !== "addon") setTaxonomyDependsOn([]);
                  setTaxonomyUnconfigured(false);
                  markTaxonomyDirty();
                }}
              >
                <option value="">{labels.taxonomyTypeUnset}</option>
                <option value="primary">{labels.taxonomyTypePrimary}</option>
                <option value="addon">{labels.taxonomyTypeAddon}</option>
                <option value="voice">{labels.taxonomyTypeVoice}</option>
                <option value="sales_growth">{labels.taxonomyTypeSalesGrowth}</option>
                <option value="other">{labels.taxonomyTypeOther}</option>
              </select>
            </label>
            <label className="mt-3 block text-sm font-semibold text-[color:var(--aipify-text-primary)]">
              {labels.category}
              <select
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm"
                value={taxonomyCategoryId}
                onChange={(event) => {
                  setTaxonomyCategoryId(event.target.value);
                  setTaxonomyUnconfigured(false);
                  markTaxonomyDirty();
                }}
              >
                <option value="">{labels.taxonomyTypeUnset}</option>
                {PRODUCT_TAXONOMY_CATEGORY_OPTIONS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
              {labels.taxonomyCategoryHint}
            </p>
            {taxonomyShowsDependencyPicker(taxonomyType || null) ? (
              <fieldset className="mt-4 space-y-2">
                <legend className="text-sm font-semibold text-[color:var(--aipify-text-primary)]">
                  {labels.taxonomyDependsOn}
                </legend>
                <p className="text-sm text-[color:var(--aipify-text-secondary)]">
                  {labels.taxonomyDependsOnHint}
                </p>
                <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                  {labels.taxonomyAllSemantics}
                </p>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-[color:var(--aipify-border)] p-2">
                  {dependencyCandidates
                    .filter((key) => key !== productKey.trim().toLowerCase())
                    .map((key) => {
                      const checked = taxonomyDependsOn.includes(key);
                      return (
                        <label key={key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setTaxonomyDependsOn((prev) =>
                                checked ? prev.filter((k) => k !== key) : [...prev, key],
                              );
                              setTaxonomyUnconfigured(false);
                              markTaxonomyDirty();
                            }}
                          />
                          <span className="font-mono text-xs">{key}</span>
                        </label>
                      );
                    })}
                  {dependencyCandidates.filter((key) => key !== productKey.trim().toLowerCase())
                    .length === 0 ? (
                    <p className="text-sm text-[color:var(--aipify-text-secondary)]">—</p>
                  ) : null}
                </div>
              </fieldset>
            ) : null}
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
            {!canPersistVariants ? (
              <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">
                {labels.variantCommissionNotSaved}
              </p>
            ) : null}
            {variantsLoadError ? (
              <p className="mt-1 text-sm text-red-700" role="alert">
                {variantsLoadError}
              </p>
            ) : null}
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
                  <p className="text-sm text-[color:var(--aipify-text-secondary)]">
                    {labels.legacyProductCommissionHint}
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
                    <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                      {labels.variantBuilder.vatExclusive}
                    </span>
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
              {taxonomyType || taxonomyCategoryId || labels.taxonomyTypeUnset}
            </p>
            {(() => {
              const binding = resolveProductModuleBinding(productKey);
              if (!binding.moduleKey) return null;
              return (
                <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">
                  <span className="font-medium text-[color:var(--aipify-text-primary)]">
                    {labels.moduleBinding}:{" "}
                  </span>
                  <span className="font-mono text-xs">{binding.moduleKey}</span>
                  {" · "}
                  {binding.appMenuEligible ? labels.moduleReady : labels.moduleNotReady}
                </p>
              );
            })()}
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

      {readinessReport ? (
        <div id="product-publication-readiness">
          <ProductPublicationReadinessPanel
            labels={labels.publicationReadiness}
            report={readinessReport}
            catalogProduct={catalogProduct}
            previewLocale={previewLocale}
          />
        </div>
      ) : null}
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

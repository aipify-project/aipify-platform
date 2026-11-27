"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Download, ImageIcon, Link2, Share2, Type } from "lucide-react";
import { buildCspPublicLinkPath } from "@/lib/certified-sales-partner/attribution-policy";
import {
  buildCspBannerHtml,
  CSP_BANNER_FORMATS,
  matchBannerMaterial,
} from "@/lib/certified-sales-partner/banner-formats";
import {
  CSP_SALES_MATERIAL_CATEGORIES,
  getPublishedProductImage,
  listPublishedSalesCopyForLocale,
} from "@/lib/certified-sales-partner/sales-materials-catalog";
import { isCspShareLocale } from "@/lib/certified-sales-partner/share-locale";
import {
  buildCspSocialShareUrl,
  composeCspShareText,
  cspSocialPlatformSupportsWebShare,
  type CspSocialPlatform,
} from "@/lib/certified-sales-partner/social-share";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { evaluateSalesLinkGates } from "@/lib/certified-sales-partner/partner-overview";
import { AipifyAlert, AipifyCard, AipifyPageHeader, AipifyTabs } from "./design";
import { CspSocialPlatformPicker } from "./CspSocialPlatformPicker";
import { CopyableApprovedSnippet, SalesExperienceHero, SalesGuidanceStepper } from "./sales-experience";
import { writeClipboard } from "./csp-sales-links-client";
import { useCspPortal } from "./CspPortalSessionProvider";
import type { buildToolsExperience } from "@/lib/partners-portal/sales-experience-content";

type ToolsExperience = ReturnType<typeof buildToolsExperience>;
import type { CspMarketingLabels } from "./CertifiedSalesPartnerPortalPanels";

type ProductKey = "kompis_web" | "kompis_bedrift" | "aipify_voice";
type CenterTab = "banners" | "texts" | "share";

type MaterialRow = {
  id: string;
  category: (typeof CSP_SALES_MATERIAL_CATEGORIES)[number];
  labelKey: string;
  href: string;
  assetPath: string;
  published: boolean;
  productKeys: string[];
};

function productSellable(portal: ReturnType<typeof useCspPortal>, product: ProductKey): boolean {
  if (!portal || product === "aipify_voice") return false;
  return evaluateSalesLinkGates(portal.overview, product).allowed;
}

/**
 * Marketing Center — product picker + Banners | Texts | Share.
 * Reuses approved sales-copy catalog and Core materials; never invents banners or posts.
 */
export function CertifiedSalesPartnerMarketingCenter({
  labels,
  locale,
  experience,
}: {
  labels: CspMarketingLabels;
  locale: string;
  experience?: ToolsExperience;
}) {
  const portal = useCspPortal();
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState<ProductKey>("kompis_web");
  const [marketingLocale, setMarketingLocale] = useState<Locale>(isCspShareLocale(locale) ? locale : "en");
  const [tab, setTab] = useState<CenterTab>("texts");
  const [section, setSection] = useState<"center" | "library">("center");
  const [workspace, setWorkspace] = useState<"process" | "conversations" | "materials" | "sharing">("process");
  const [platforms, setPlatforms] = useState<CspSocialPlatform[]>([]);
  const [copyId, setCopyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [coreMaterials, setCoreMaterials] = useState<MaterialRow[] | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const query = new URLSearchParams(window.location.search);
    const library = query.get("section") === "library";
    setSection(library ? "library" : "center");
    if (library) setWorkspace("materials");
  }, []);

  function chooseSection(next: "center" | "library") {
    setSection(next);
    const query = new URLSearchParams(window.location.search);
    if (next === "library") query.set("section", "library");
    else query.delete("section");
    const suffix = query.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
  }

  const sellable = productSellable(portal, product);
  const activeLink = portal?.links.find((l) => l.active && l.code) ?? null;
  const publicPath =
    activeLink?.code && sellable
      ? (() => {
          const path = buildCspPublicLinkPath({
            code: activeLink.code!,
            productKey: product,
            channel: "referral_link",
          });
          return path ? `${path}&lang=${marketingLocale}` : null;
        })()
      : null;
  const publicUrl = publicPath ? `${origin || ""}${publicPath}` : null;

  useEffect(() => {
    let cancelled = false;
    if (product === "aipify_voice") {
      setCoreMaterials([]);
      return;
    }
    void (async () => {
      try {
        const res = await fetch(
          `/api/certified-sales-partner/materials?product_key=${encodeURIComponent(product)}`,
          { cache: "no-store" },
        );
        const body = (await res.json().catch(() => null)) as {
          found?: boolean;
          materials?: Array<{
            material_key?: string;
            category?: string;
            asset_path?: string;
            mime_hint?: string;
            published?: boolean;
            product_keys?: string[];
          }>;
        } | null;
        if (cancelled) return;
        if (!res.ok || !body?.found || !Array.isArray(body.materials)) {
          setCoreMaterials([]);
          return;
        }
        setCoreMaterials(
          body.materials
            .filter(
              (m) =>
                m.published !== false &&
                typeof m.asset_path === "string" &&
                CSP_SALES_MATERIAL_CATEGORIES.some((c) => c === m.category),
            )
            .map((m) => ({
              id: String(m.material_key ?? m.asset_path),
              category:
                CSP_SALES_MATERIAL_CATEGORIES.find((c) => c === m.category) ?? "pdf_sheets",
              labelKey: String(m.material_key ?? "material"),
              href: String(m.asset_path),
              assetPath: String(m.asset_path),
              published: true,
              productKeys: Array.isArray(m.product_keys) ? m.product_keys : [],
            })),
        );
      } catch {
        if (!cancelled) setCoreMaterials([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  const materials = coreMaterials ?? [];
  const copyItems = useMemo(
    () =>
      product === "aipify_voice"
        ? []
        : listPublishedSalesCopyForLocale({ productKey: product, locale: marketingLocale }),
    [product, marketingLocale],
  );
  const selectedCopy = copyItems.find((c) => c.id === copyId) ?? copyItems[0] ?? null;
  const productImage = product === "aipify_voice" ? null : getPublishedProductImage(product);

  async function copyText(withLink: boolean) {
    if (!selectedCopy) {
      setNotice(labels.shareNoCopy);
      return;
    }
    const payload =
      withLink && publicUrl ? composeCspShareText(selectedCopy.text, publicUrl) : selectedCopy.text;
    setNotice((await writeClipboard(payload)) ? labels.shareTextCopied : labels.shareNoCopy);
  }

  async function copyLink() {
    if (!publicUrl) {
      setNotice(labels.linkEmpty);
      return;
    }
    setNotice((await writeClipboard(publicUrl)) ? labels.shareLinkCopied : labels.linkEmpty);
  }

  async function copyBannerHtml(format: (typeof CSP_BANNER_FORMATS)[number]) {
    const matched = matchBannerMaterial(
      materials.map((m) => ({ href: m.href, assetPath: m.assetPath, category: m.category })),
      format,
    );
    if (!matched || !publicUrl) {
      setNotice(labels.bannerNotPublished);
      return;
    }
    const html = buildCspBannerHtml({
      imageUrl: matched.href.startsWith("http") ? matched.href : `${origin}${matched.href}`,
      linkUrl: publicUrl,
      width: format.width,
      height: format.height,
      alt: labels.productName[product] ?? "Aipify",
    });
    if (!html) {
      setNotice(labels.bannerNotPublished);
      return;
    }
    setNotice((await writeClipboard(html)) ? labels.bannerHtmlCopied : labels.bannerNotPublished);
  }

  function openShare(platform: CspSocialPlatform) {
    if (!publicUrl) {
      setNotice(labels.linkEmpty);
      return;
    }
    if (!cspSocialPlatformSupportsWebShare(platform)) {
      setNotice(labels.shareNoWeb);
      return;
    }
    const shareUrl = buildCspSocialShareUrl(platform, {
      url: publicUrl,
      text: selectedCopy?.text ?? "",
    });
    if (!shareUrl) {
      setNotice(labels.shareNoWeb);
      return;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  const productTabs = [
    { id: "kompis_web", label: labels.filterKompisWeb },
    { id: "kompis_bedrift", label: labels.filterKompisBedrift },
    { id: "aipify_voice", label: labels.filterVoice },
  ] as const;
  const approvedTone: Record<string, "personal" | "informative" | "short" | undefined> = {
    start: "personal",
    value: "informative",
    followUp: "short",
  };
  const approvedCopy = listPublishedSalesCopyForLocale({ productKey: product, locale: marketingLocale });

  return (
    <div className="w-full space-y-5">
      {experience ? (
        <>
          <SalesExperienceHero hero={experience.hero} />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label={experience.tabsLabel}>
            {(
              [
                ["process", experience.tabs.process],
                ["conversations", experience.tabs.conversations],
                ["materials", experience.tabs.materials],
                ["sharing", experience.tabs.sharing],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={workspace === id}
                onClick={() => setWorkspace(id)}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] ${
                  workspace === id ? "bg-[#7C3AED] text-white" : "border border-[#E8E4F2] bg-white text-[#1E293B]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {workspace === "process" ? (
            <SalesGuidanceStepper
              label={experience.stepsLabel}
              steps={experience.steps}
              whyLabel={experience.whyLabel}
              sayLabel={experience.sayLabel}
              exampleLabel={experience.exampleLabel}
              notice={experience.notice}
              avoidLabel={experience.avoidLabel}
              avoid={experience.avoid}
            />
          ) : null}
          {workspace === "sharing" ? (
            <section className="rounded-2xl border border-[#E8E4F2] bg-white p-5">
              <h2 className="text-xl font-semibold text-[#1E293B]">{experience.sharingTitle}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{experience.sharingBody}</p>
              <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {experience.channels.map((channel) => (
                  <li key={channel.id} className="rounded-xl bg-[#F6F4FB] p-4">
                    <p className="text-sm font-semibold text-[#1E293B]">{channel.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#475569]">{channel.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {workspace === "conversations" ? (
          <section aria-labelledby="csp-help-categories" className="space-y-3">
            <h2 id="csp-help-categories" className="text-xl font-semibold text-[#1E293B]">
              {experience.tabs.conversations}
            </h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {experience.categories.map((category) => {
                const tone = approvedTone[category.id];
                const text = tone ? approvedCopy.find((row) => row.tone === tone)?.text ?? null : null;
                return (
                  <article key={category.id} className="flex h-full flex-col rounded-2xl border border-[#E8E4F2] bg-white p-5">
                    <h3 className="text-base font-semibold text-[#1E293B]">{category.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">{category.body}</p>
                    {text ? (
                      <CopyableApprovedSnippet
                        label={experience.approvedLabel}
                        text={text}
                        copyLabel={experience.copy}
                        copiedLabel={experience.copied}
                        failedLabel={experience.copyFailed}
                        onCopy={writeClipboard}
                      />
                    ) : null}
                    {category.action ? (
                      <Link
                        href={category.action.href}
                        className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-[#5538D3]"
                      >
                        {category.action.label}
                      </Link>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
          ) : null}
        </>
      ) : null}
      {(!experience || workspace === "materials") ? (
      <>
      {experience ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#1E293B]">{labels.centerTitle}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseSection("center")}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                section === "center" ? "bg-[#7C3AED] text-white" : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {labels.toolsTab}
            </button>
            <button
              type="button"
              onClick={() => chooseSection("library")}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                section === "library" ? "bg-[#7C3AED] text-white" : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {labels.libraryTab}
            </button>
          </div>
        </div>
      ) : (
      <AipifyPageHeader
        title={labels.centerTitle}
        description={labels.centerIntro}
        eyebrow="Aipify"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => chooseSection("center")}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                section === "center"
                  ? "bg-[#7C3AED] text-white"
                  : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {labels.toolsTab}
            </button>
            <button
              type="button"
              onClick={() => chooseSection("library")}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                section === "library"
                  ? "bg-[#7C3AED] text-white"
                  : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {labels.libraryTab}
            </button>
          </div>
        }
      />
      )}

      <AipifyCard padding="sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">{labels.productTabs}</p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={labels.productTabs}>
          {productTabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setProduct(item.id)}
              className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                product === item.id
                  ? "bg-[#F3EDFF] text-[#7C3AED] ring-1 ring-[#D3C7FF]"
                  : "border border-[#E8E4F2] text-[#475569]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {product === "aipify_voice" ? (
          <p className="mt-3 text-sm text-[#64748B]">{labels.voiceNote}</p>
        ) : !sellable ? (
          <p className="mt-3 text-sm text-[#64748B]">{labels.certRequired}</p>
        ) : null}
      </AipifyCard>

      {section === "library" ? (
        <AipifyCard>
          <h2 className="text-lg font-semibold text-[#1E293B]">{labels.materialsTitle}</h2>
          <p className="mt-2 text-sm text-[#64748B]">{labels.materialsIntro}</p>
          {materials.length === 0 ? (
            <div className="mt-4">
              <AipifyAlert tone="info" title={labels.assetsEmptyTitle}>
                {labels.assetsEmptyBody}
              </AipifyAlert>
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {materials.map((m) => (
                <li key={m.id} className="rounded-xl border border-[#E8E4F2] p-4">
                  <p className="text-sm font-semibold text-[#1E293B]">
                    {labels.materialsCategories[m.category] ?? m.labelKey}
                  </p>
                  <a
                    href={m.href}
                    className="mt-3 inline-flex text-sm font-semibold text-[#7C3AED] hover:underline"
                    download
                  >
                    {labels.materialsDownload}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </AipifyCard>
      ) : (
        <>
          <AipifyTabs
            ariaLabel={labels.centerTitle}
            activeId={tab}
            onChange={(id) => setTab(id as CenterTab)}
            items={[
              {
                id: "banners",
                label: labels.tabBanners,
                icon: <ImageIcon className="h-4 w-4" aria-hidden />,
              },
              {
                id: "texts",
                label: labels.tabTexts,
                icon: <Type className="h-4 w-4" aria-hidden />,
              },
              {
                id: "share",
                label: labels.tabShare,
                icon: <Share2 className="h-4 w-4" aria-hidden />,
              },
            ]}
          />

          {tab === "banners" ? (
            <div className="space-y-4">
              <AipifyAlert tone="info">{labels.bannerIntro}</AipifyAlert>
              <div className="grid gap-4 md:grid-cols-2">
                {CSP_BANNER_FORMATS.map((format) => {
                  const matched = matchBannerMaterial(
                    materials.map((m) => ({
                      href: m.href,
                      assetPath: m.assetPath,
                      category: m.category,
                    })),
                    format,
                  );
                  const published = Boolean(matched) && Boolean(publicUrl) && sellable;
                  return (
                    <AipifyCard key={format.id} padding="md">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#1E293B]">
                            {labels.bannerFormats[format.labelKey]}
                          </p>
                          <p className="mt-1 text-xs text-[#94A3B8]">
                            {format.width}×{format.height}
                          </p>
                        </div>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EDFF] text-[#7C3AED]">
                          <ImageIcon className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                      {published && matched ? (
                        <div className="mt-4 overflow-hidden rounded-lg border border-[#E8E4F2] bg-[#F8F7FC] p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={matched.href}
                            alt=""
                            width={format.width}
                            height={format.height}
                            className="mx-auto max-h-40 w-auto max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <p className="mt-4 rounded-xl bg-[#F8F7FC] px-3 py-6 text-center text-sm text-[#64748B]">
                          {labels.bannerNotPublished}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={!published}
                          onClick={() => void copyBannerHtml(format)}
                          className="inline-flex min-h-10 items-center rounded-xl bg-[#7C3AED] px-3 text-sm font-semibold text-white disabled:opacity-40"
                        >
                          {labels.bannerCopyHtml}
                        </button>
                        <button
                          type="button"
                          disabled={!publicUrl || !sellable}
                          onClick={() => void copyLink()}
                          className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#1E293B] disabled:opacity-40"
                        >
                          <Link2 className="h-4 w-4" aria-hidden />
                          {labels.shareCopyLink}
                        </button>
                        {matched ? (
                          <a
                            href={matched.href}
                            download
                            className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold text-[#1E293B]"
                          >
                            <Download className="h-4 w-4" aria-hidden />
                            {labels.shareDownloadImage}
                          </a>
                        ) : null}
                      </div>
                    </AipifyCard>
                  );
                })}
              </div>
            </div>
          ) : null}

          {tab === "texts" ? (
            <div className="space-y-4">
              <AipifyCard padding="sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {labels.localeTabs}
                </p>
                <p className="mt-1 text-xs text-[#64748B]">{labels.marketingLocaleNote}</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={labels.localeTabs}>
                  {LOCALES.filter((l) => isCspShareLocale(l)).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setMarketingLocale(code)}
                      className={`inline-flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold ${
                        marketingLocale === code
                          ? "bg-[#F3EDFF] text-[#7C3AED] ring-1 ring-[#D3C7FF]"
                          : "border border-[#E8E4F2] text-[#475569]"
                      }`}
                    >
                      {LOCALE_LABELS[code] ?? code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </AipifyCard>

              {product === "aipify_voice" ? (
                <AipifyAlert tone="neutral">{labels.voiceNote}</AipifyAlert>
              ) : copyItems.length === 0 ? (
                <AipifyAlert tone="warning" title={labels.missingLocale}>
                  {labels.missingLocale}
                </AipifyAlert>
              ) : (
                <ul className="grid gap-3 lg:grid-cols-2">
                  {copyItems.map((item) => {
                    const active = (selectedCopy?.id ?? null) === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setCopyId(item.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-[#7C3AED] bg-[#F7F4FF] ring-1 ring-[#D3C7FF]"
                              : "border-[#E8E4F2] bg-white hover:border-[#7C3AED]/35"
                          }`}
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED]">
                            {item.tone || labels.shareApprovedCopy}
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#1E293B]">
                            {item.text}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!selectedCopy}
                  onClick={() => void copyText(false)}
                  className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {labels.shareCopyText}
                </button>
                <button
                  type="button"
                  disabled={!selectedCopy || !publicUrl}
                  onClick={() => void copyText(true)}
                  className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#1E293B] disabled:opacity-40"
                >
                  {labels.copyTextAndLink}
                </button>
              </div>
            </div>
          ) : null}

          {tab === "share" ? (
            <div className="space-y-4">
              <AipifyCard>
                <h2 className="text-base font-semibold text-[#1E293B]">{labels.shareWorkspaceTitle}</h2>
                {selectedCopy ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#475569]">
                    {selectedCopy.text}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-[#64748B]">{labels.shareNoCopy}</p>
                )}
                {productImage?.href ? (
                  <div className="mt-4 overflow-hidden rounded-xl border border-[#E8E4F2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={productImage.href} alt="" className="mx-auto max-h-48 w-auto object-contain" />
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#64748B]">{labels.shareNoImage}</p>
                )}
                {publicPath ? (
                  <p className="mt-4 break-all rounded-xl bg-[#F8F7FC] px-3 py-2 font-mono text-xs text-[#475569]">
                    <Link href={publicPath} className="hover:underline">
                      {publicUrl || publicPath}
                    </Link>
                  </p>
                ) : (
                  <div className="mt-4">
                    <AipifyAlert
                      tone="info"
                      actions={
                        <Link
                          href="/partners/referrals/links"
                          className="text-sm font-semibold text-[#7C3AED]"
                        >
                          {labels.linkCta}
                        </Link>
                      }
                    >
                      {labels.linkEmpty}
                    </AipifyAlert>
                  </div>
                )}
              </AipifyCard>

              <AipifyCard>
                <CspSocialPlatformPicker
                  labels={labels.social}
                  value={platforms}
                  onChange={setPlatforms}
                  disabled={!sellable}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!selectedCopy}
                    onClick={() => void copyText(false)}
                    className="inline-flex min-h-10 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold disabled:opacity-40"
                  >
                    {labels.shareCopyText}
                  </button>
                  <button
                    type="button"
                    disabled={!publicUrl}
                    onClick={() => void copyLink()}
                    className="inline-flex min-h-10 items-center rounded-xl border border-[#E8E4F2] px-3 text-sm font-semibold disabled:opacity-40"
                  >
                    {labels.shareCopyLink}
                  </button>
                  {platforms.filter(cspSocialPlatformSupportsWebShare).map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      disabled={!publicUrl}
                      onClick={() => openShare(platform)}
                      className="inline-flex min-h-10 items-center rounded-xl bg-[#7C3AED] px-3 text-sm font-semibold text-white disabled:opacity-40"
                    >
                      {labels.shareOpen}: {labels.social.platforms[platform]}
                    </button>
                  ))}
                </div>
                {platforms.some((p) => !cspSocialPlatformSupportsWebShare(p)) ? (
                  <p className="mt-3 text-xs text-[#64748B]">{labels.shareNoWeb}</p>
                ) : null}
              </AipifyCard>
            </div>
          ) : null}
        </>
      )}
      </>
      ) : null}

      {notice ? (
        <p className="text-sm font-medium text-[#5538D3]" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}

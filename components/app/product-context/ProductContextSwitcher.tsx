"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";
import { writeProductContextCookie } from "@/lib/app-portal/product-context/cookie-client";
import { productDashboardHref } from "@/lib/app-portal/product-context/resolve";
import { inferProductContextFromPathname } from "@/lib/app-portal/product-context/infer-from-pathname";

export type ProductContextSwitcherLabels = {
  label: string;
  activeProduct: string;
  switchProduct: string;
  kompisWeb: string;
  kompisBedrift: string;
  singleContextHint: string;
  close: string;
};

type ProductContextSwitcherProps = {
  activeProduct: AppProductContextId | null;
  availableProducts: AppProductContextId[];
  organizationName: string;
  labels: ProductContextSwitcherLabels;
  pathname: string;
};

function productLabel(id: AppProductContextId, labels: ProductContextSwitcherLabels): string {
  return id === "kompisWeb" ? labels.kompisWeb : labels.kompisBedrift;
}

/**
 * Top-of-shell product context control — not nested under the sidebar menu.
 */
export function ProductContextSwitcher({
  activeProduct,
  availableProducts,
  organizationName,
  labels,
  pathname,
}: ProductContextSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inferred = inferProductContextFromPathname(pathname);
    if (inferred && availableProducts.includes(inferred)) {
      writeProductContextCookie(inferred);
    }
  }, [pathname, availableProducts]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!activeProduct || availableProducts.length === 0) {
    return null;
  }

  const activeLabel = productLabel(activeProduct, labels);
  const canSwitch = availableProducts.length > 1;

  function selectProduct(product: AppProductContextId) {
    writeProductContextCookie(product);
    setOpen(false);
    if (product !== activeProduct) {
      router.push(productDashboardHref(product));
      router.refresh();
    }
  }

  return (
    <div ref={ref} className="mb-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-aipify-text-secondary">
        {labels.label}
      </p>
      <div className="rounded-xl border border-aipify-border bg-white px-3 py-2.5 shadow-sm">
        <p className="truncate text-sm font-semibold text-aipify-text" title={organizationName}>
          {organizationName}
        </p>
        <p className="mt-0.5 text-sm text-aipify-text-secondary">
          <span className="sr-only">{labels.activeProduct}: </span>
          {activeLabel}
        </p>
        {canSwitch ? (
          <button
            type="button"
            className="mt-2 w-full rounded-lg bg-aipify-companion/10 px-3 py-2 text-left text-sm font-medium text-aipify-companion transition hover:bg-aipify-companion/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {labels.switchProduct}
          </button>
        ) : (
          <p className="mt-2 text-xs text-aipify-text-secondary">{labels.singleContextHint}</p>
        )}
      </div>
      {open && canSwitch ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={labels.switchProduct}
          className="mt-2 space-y-2 rounded-xl border border-aipify-border bg-white p-2 shadow-lg"
        >
          {availableProducts.map((product) => {
            const selected = product === activeProduct;
            return (
              <button
                key={product}
                type="button"
                onClick={() => selectProduct(product)}
                className={`flex w-full flex-col rounded-lg px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus ${
                  selected
                    ? "bg-aipify-companion text-white"
                    : "bg-aipify-canvas hover:bg-aipify-companion/10 text-aipify-text"
                }`}
                aria-current={selected ? "true" : undefined}
              >
                <span className="text-sm font-semibold">{productLabel(product, labels)}</span>
                <span className={`text-xs ${selected ? "text-white/80" : "text-aipify-text-secondary"}`}>
                  {organizationName}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-sm text-aipify-text-secondary hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
            onClick={() => setOpen(false)}
          >
            {labels.close}
          </button>
        </div>
      ) : null}
    </div>
  );
}

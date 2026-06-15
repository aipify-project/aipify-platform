"use client";

import { AipifyLoaderAnimation } from "@/components/ui/aipify-loader-animation";
import { AIPIFY_LOADER_DEFAULT_LABEL } from "@/lib/loading/aipify-loader-assets";

type LoaderSize = "sm" | "md" | "lg";

export type AipifyLoaderProps = {
  label?: string;
  size?: LoaderSize;
  centered?: boolean;
  fullPage?: boolean;
  subtle?: boolean;
  className?: string;
};

export function AipifyLoader({
  label = AIPIFY_LOADER_DEFAULT_LABEL,
  size = "md",
  centered = true,
  fullPage = false,
  subtle = true,
  className = "",
}: AipifyLoaderProps) {
  const containerClasses = [
    "w-full bg-transparent",
    fullPage ? "min-h-[calc(100vh-10rem)]" : "min-h-[280px]",
    centered ? "flex flex-col items-center justify-center text-center" : "",
    subtle ? "py-12" : "py-8",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
      <AipifyLoaderAnimation size={size} label={label} />
      <p className="mt-5 max-w-sm text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}

"use client";

import { AipifyLoadingState, type AipifyLoadingStateProps } from "@/components/ui/aipify-loading-state";
import { AIPIFY_LOADER_DEFAULT_LABEL } from "@/lib/loading/aipify-loader-assets";

type LoaderSize = "sm" | "md" | "lg";

export type AipifyLoaderProps = {
  label?: string;
  size?: LoaderSize;
  centered?: boolean;
  fullPage?: boolean;
  subtle?: boolean;
  className?: string;
  showActivePulse?: boolean;
  showStatusIndicator?: boolean;
  preset?: AipifyLoadingStateProps["preset"];
};

export function AipifyLoader({
  label = AIPIFY_LOADER_DEFAULT_LABEL,
  size = "md",
  centered = true,
  fullPage = false,
  className = "",
  showActivePulse = true,
  showStatusIndicator = false,
  preset = "workspace",
}: AipifyLoaderProps) {
  return (
    <AipifyLoadingState
      message={label}
      preset={preset}
      size={size}
      centered={centered}
      fullPage={fullPage}
      className={className}
      showActivePulse={showActivePulse}
      showStatusIndicator={showStatusIndicator}
    />
  );
}

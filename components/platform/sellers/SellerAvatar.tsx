"use client";

import { useState } from "react";
import { sellerInitials } from "@/lib/certified-sales-partner/seller-avatar";

type Props = {
  name: string | null;
  imageUrl: string | null;
  /** Decorative by default; pass a label when the image is the only identity cue. */
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

/** Seller avatar: profile photo when Core has one, otherwise initials. Falls back if the image fails. */
export function SellerAvatar({ name, imageUrl, alt = "", size = "md", className = "" }: Props) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedUrl !== imageUrl;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#EEF0FB] font-semibold text-[#4B3BB8] ring-1 ring-[color:var(--aipify-border)] ${SIZE[size]} ${className}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-scoped avatar route / external https URL
        <img
          src={imageUrl as string}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <span aria-hidden="true">{sellerInitials(name)}</span>
      )}
    </span>
  );
}

import Image from "next/image";
import {
  PROVIDER_LOGO_CONTAINER_CLASS,
  PROVIDER_LOGO_IMAGE_CLASS,
  PROVIDER_LOGO_MAX_HEIGHT_PX,
  PROVIDER_LOGO_PATHS,
  type PaymentProviderKey,
} from "@/lib/payment-providers";

export {
  PROVIDER_LOGO_CONTAINER_CLASS,
  PROVIDER_LOGO_MAX_HEIGHT_PX,
} from "@/lib/payment-providers";

export type ProviderLogoProps = {
  provider: PaymentProviderKey;
  alt: string;
  priority?: boolean;
  className?: string;
};

/** Official Aipify payment provider logo — 60px container, 36px max logo height, no modifications. */
export function ProviderLogo({
  provider,
  alt,
  priority = false,
  className,
}: ProviderLogoProps) {
  return (
    <div className={className ?? PROVIDER_LOGO_CONTAINER_CLASS}>
      <Image
        src={PROVIDER_LOGO_PATHS[provider]}
        alt={alt}
        width={180}
        height={PROVIDER_LOGO_MAX_HEIGHT_PX}
        priority={priority}
        className={PROVIDER_LOGO_IMAGE_CLASS}
        style={{ width: "auto", height: `${PROVIDER_LOGO_MAX_HEIGHT_PX}px` }}
      />
    </div>
  );
}

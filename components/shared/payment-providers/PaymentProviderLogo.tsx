import Image from "next/image";
import {
  PROVIDER_LOGO_IMAGE_CLASS,
  PROVIDER_LOGO_PATHS,
  PROVIDER_VISUAL_PROFILES,
  type PaymentProviderKey,
} from "@/lib/payment-providers";

type PaymentProviderLogoProps = {
  provider: PaymentProviderKey;
  alt: string;
  priority?: boolean;
};

const LOGO_DIMENSIONS: Record<PaymentProviderKey, { width: number; height: number }> = {
  stripe: { width: 96, height: 40 },
  klarna: { width: 120, height: 28 },
  vipps: { width: 180, height: 40 },
  dnb: { width: 88, height: 32 },
};

export function PaymentProviderLogo({ provider, alt, priority = false }: PaymentProviderLogoProps) {
  const profile = PROVIDER_VISUAL_PROFILES[provider];
  const dims = LOGO_DIMENSIONS[provider];

  return (
    <div className="flex items-center" aria-hidden={false}>
      <Image
        src={PROVIDER_LOGO_PATHS[provider]}
        alt={alt}
        width={dims.width}
        height={dims.height}
        priority={priority}
        className={`${PROVIDER_LOGO_IMAGE_CLASS} ${profile.logoMaxWidth}`}
        style={{ width: "auto", height: "32px" }}
      />
    </div>
  );
}

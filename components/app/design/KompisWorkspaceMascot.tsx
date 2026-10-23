import Image from "next/image";

/**
 * Approved Premium V2 Kompis mark.
 * Source: public/website-kompis/dashboard/kompis_mascot_premium_v2.png
 * The asset is front-facing. Inward attention is a lean toward the page copy,
 * not a new illustration. Motion is CSS only and stops under reduced motion.
 */
export function KompisWorkspaceMascot() {
  return (
    <div className="aipify-workspace-mascot" aria-hidden="true">
      <Image
        src="/website-kompis/dashboard/kompis_mascot_premium_v2.png"
        alt=""
        width={320}
        height={320}
        className="aipify-workspace-mascot__figure"
        priority={false}
      />
      <span className="aipify-workspace-mascot__blink" />
      <span className="aipify-workspace-mascot__bulb">
        <svg viewBox="0 0 32 32" width="28" height="28" focusable="false">
          <path
            d="M16 4.5a8 8 0 0 0-4.2 14.8c.5.4.8 1 .8 1.6v1.1h6.8v-1.1c0-.6.3-1.2.8-1.6A8 8 0 0 0 16 4.5Z"
            fill="#F6E7A8"
            stroke="#E2C15A"
            strokeWidth="1.2"
          />
          <path d="M13.2 23.2h5.6M14 25.4h4" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

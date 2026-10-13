import Image from "next/image";

/**
 * Discrete Aipify decorative accent for hub/dashboard headers.
 * Uses the authentic Kompis mascot inside the soft circle — never overlays interactive text.
 * Parent must be relative with content z-indexed above.
 */
export function AppDecorativeOrb({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aipify-app-decorative-orb ${className}`.trim()}
      aria-hidden="true"
      data-app-visual-layer="decorative-orb"
    >
      <Image
        src="/brand/aipify-kompis-avatar.png"
        alt=""
        width={176}
        height={176}
        className="aipify-app-decorative-orb__mascot"
        priority={false}
      />
    </div>
  );
}

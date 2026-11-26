import Image from "next/image";
import {
  productHeroAccentClass,
  type WorkspaceProductHero,
} from "@/lib/commercial-packages/product-hero";

type ProductHeroTileProps = {
  hero: WorkspaceProductHero;
  title: string;
  descriptor: string;
  alt: string;
};

/** Premium brand tile — gradient + mark + name. Swap logoSrc when approved assets ship. */
export function ProductHeroTile({ hero, title, descriptor, alt }: ProductHeroTileProps) {
  return (
    <div
      className={`relative flex h-28 flex-col justify-end overflow-hidden bg-gradient-to-br sm:h-32 ${productHeroAccentClass(hero.accent)} px-5 pb-4 pt-5`}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-white/40 blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-sm">
          {hero.logoSrc ? (
            <Image src={hero.logoSrc} alt="" width={28} height={28} className="object-contain" />
          ) : (
            <span className="text-lg font-semibold text-[var(--app-primary)]" aria-hidden>
              {hero.letter}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-[var(--app-text)]">{title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[var(--app-text-muted)]">
            {descriptor}
          </p>
        </div>
      </div>
      <span className="sr-only">{alt}</span>
    </div>
  );
}

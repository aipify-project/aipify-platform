import Image from "next/image";

/**
 * Soft Public Home–family atmosphere for /login, /register and related public auth shells.
 * Decorative only — does not alter auth routes or frozen Website Kompis runtime.
 */
export function PublicAccessAtmosphere({
  showMascot = true,
}: {
  showMascot?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 10% 4%, rgba(115,87,232,.14), transparent 27rem), radial-gradient(circle at 90% 12%, rgba(85,119,242,.13), transparent 30rem), #f3f5fb",
        }}
      />
      <div
        className="absolute -right-28 top-16 h-[170px] w-[560px] rotate-[-12deg] rounded-full opacity-50"
        style={{
          background:
            "linear-gradient(100deg, rgba(115,87,232,.02), rgba(115,87,232,.18), rgba(85,119,242,.06))",
        }}
      />
      <div
        className="absolute -right-20 top-52 h-[110px] w-[460px] rotate-[-12deg] rounded-full opacity-45"
        style={{
          background:
            "linear-gradient(100deg, rgba(85,119,242,.02), rgba(85,119,242,.12), rgba(255,255,255,.05))",
        }}
      />
      {showMascot ? (
        <Image
          src="/brand/aipify-kompis-avatar.png"
          alt=""
          width={420}
          height={420}
          className="absolute -right-16 bottom-[-40px] hidden w-[min(42vw,380px)] opacity-[0.16] sm:block"
          style={{
            transform: "rotate(-12deg)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 40%)",
            maskImage: "linear-gradient(90deg, transparent, #000 40%)",
          }}
          priority={false}
        />
      ) : null}
    </div>
  );
}

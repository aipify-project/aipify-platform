"use client";

import { useEffect, useRef, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import {
  AIPIFY_LOADER_ANIMATION_SIZE,
  AIPIFY_LOADER_ASSETS,
  type AipifyLoaderAnimationMode,
} from "@/lib/loading/aipify-loader-assets";

type LoaderSize = keyof typeof AIPIFY_LOADER_ANIMATION_SIZE;

type AipifyLoaderAnimationProps = {
  size?: LoaderSize;
  label: string;
  className?: string;
};

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

export function AipifyLoaderAnimation({
  size = "md",
  label,
  className = "",
}: AipifyLoaderAnimationProps) {
  const dimension = AIPIFY_LOADER_ANIMATION_SIZE[size];
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<AipifyLoaderAnimationMode>(
    prefersReducedMotion ? "static" : "lottie",
  );
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const lottieInstanceRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setMode("static");
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (mode !== "lottie" || !lottieContainerRef.current) return;

    let cancelled = false;

    void (async () => {
      try {
        const [{ default: lottie }, response] = await Promise.all([
          import("lottie-web"),
          fetch(AIPIFY_LOADER_ASSETS.lottie),
        ]);

        if (!response.ok) {
          throw new Error("Lottie asset unavailable");
        }

        const animationData = await response.json();
        if (cancelled || !lottieContainerRef.current) return;

        lottieInstanceRef.current?.destroy();
        lottieInstanceRef.current = lottie.loadAnimation({
          container: lottieContainerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: true,
          },
        });
      } catch {
        if (!cancelled) setMode("webm");
      }
    })();

    return () => {
      cancelled = true;
      lottieInstanceRef.current?.destroy();
      lottieInstanceRef.current = null;
    };
  }, [mode]);

  const sharedStyle = {
    width: dimension,
    height: dimension,
  };

  if (mode === "lottie") {
    return (
      <div
        ref={lottieContainerRef}
        className={`relative shrink-0 ${className}`}
        style={sharedStyle}
        aria-hidden="true"
      />
    );
  }

  if (mode === "webm") {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        width={dimension}
        height={dimension}
        className={`shrink-0 object-contain ${className}`}
        aria-hidden="true"
        onError={() => setMode("gif")}
      >
        <source src={AIPIFY_LOADER_ASSETS.webm} type="video/webm" />
      </video>
    );
  }

  if (mode === "gif") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={AIPIFY_LOADER_ASSETS.gif}
        alt=""
        width={dimension}
        height={dimension}
        className={`shrink-0 object-contain ${className}`}
        aria-hidden="true"
        onError={() => setMode("static")}
      />
    );
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center motion-reduce:animate-none ${className}`}
      style={sharedStyle}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full bg-violet-400/20 motion-safe:animate-[aipify-loader-glow_2.4s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <AipifyPulse
        size={dimension}
        variant="gradient"
        opacity={0.95}
        title={label}
        aria-label={label}
        className="relative motion-safe:animate-[aipify-loader-pulse_2.4s_ease-in-out_infinite] text-violet-600"
      />
    </div>
  );
}

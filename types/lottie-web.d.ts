declare module "lottie-web" {
  export interface AnimationItem {
    destroy: () => void;
  }

  export interface LottiePlayer {
    loadAnimation: (options: {
      container: Element;
      renderer: "svg" | "canvas" | "html";
      loop?: boolean;
      autoplay?: boolean;
      animationData?: unknown;
      path?: string;
      rendererSettings?: {
        preserveAspectRatio?: string;
        progressiveLoad?: boolean;
      };
    }) => AnimationItem;
  }

  const lottie: LottiePlayer;
  export default lottie;
}

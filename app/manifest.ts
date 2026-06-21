import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aipify",
    short_name: "Aipify",
    description:
      "Aipify Business Operating System — operational intelligence with human control for professional organizations.",
    start_url: "/login",
    scope: "/",
    id: "/",
    display: "standalone",
    background_color: "#F7F6F3",
    theme_color: "#7C3AED",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

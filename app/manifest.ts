import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pilu",
    short_name: "Pilu",
    description: "Your baby's AI companion.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFCF7",
    theme_color: "#FFFCF7",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}

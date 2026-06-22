import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "ARSPocket",
  short_name: "ARSPocket",
  description: "Track expenses, grow savings and build wealth with confidence.",
  start_url: "/dashboard",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#008080",
  icons: [
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

export default manifest;

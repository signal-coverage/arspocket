import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.{tsx,jsx}": {
        loaders: [
          {
            loader: "@locator/webpack-loader",
            options: { env: "development" },
          },
        ],
      },
    },
  },
  allowedDevOrigins: ["192.168.100.5"],
};

export default nextConfig;

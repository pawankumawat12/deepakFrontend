import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
  env: {
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || "",
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "import.meta.env.VITE_BACKEND_URL": JSON.stringify(
          process.env.VITE_BACKEND_URL || ""
        ),
      })
    );
    return config;
  },
};

export default withPWA(nextConfig);

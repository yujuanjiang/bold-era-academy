import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "0.0.0.0",
    "*.local",
    "10.*.*.*",
    "172.*.*.*",
    "192.168.*.*",
  ],
  output: "export",
  trailingSlash: true,
};

export default nextConfig;

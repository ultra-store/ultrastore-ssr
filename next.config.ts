import type { NextConfig } from "next";

const woocommerceUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
let remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (woocommerceUrl) {
  try {
    const u = new URL(woocommerceUrl);
    remotePatterns = [
      {
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        port: u.port || undefined,
        pathname: "/**",
      },
    ];
  } catch {
    // Ignore invalid URL at build time; developer can fix env var
  }
}

const nextConfig: NextConfig = {
  // Restrict recognized page file extensions to avoid accidental pickup of legacy pages/*.js
  // This prevents conflicts like "pages/index.js" vs "app/page.tsx" in mixed environments.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  output: "standalone",
  images: {
    remotePatterns,
  },
  env: {
    // Force a single source of truth for frontend base URL
    NEXT_PUBLIC_WOOCOMMERCE_URL: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "",
  },
};

export default nextConfig;

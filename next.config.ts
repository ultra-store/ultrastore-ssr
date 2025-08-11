import type { NextConfig } from "next";

// Derive remote image patterns from WooCommerce URL env var
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
  images: {
    remotePatterns,
  },
};

export default nextConfig;

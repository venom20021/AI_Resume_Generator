import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure @react-pdf/renderer works correctly in serverless functions
  // (it uses Node.js APIs that should remain unbundled)
  serverExternalPackages: ["@react-pdf/renderer"],

  // Skip trailing slash redirects
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

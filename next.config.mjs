/** @type {import('next').NextConfig} */

// Replit serves the app through a proxied iframe on a per-repl domain.
// Allow that origin so cross-origin HMR / asset requests are not blocked in dev.
const replitDomains = (process.env.REPLIT_DOMAINS ?? "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

const nextConfig = {
  allowedDevOrigins: [
    ...replitDomains,
    ".replit.dev",
    ".repl.co",
    ".replit.app",
  ],
};

export default nextConfig;

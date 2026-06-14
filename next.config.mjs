/** @type {import('next').NextConfig} */
const nextConfig = {
  // Replit serves the app through a proxied iframe. Allow the dev origin so
  // cross-origin HMR / asset requests are not blocked in development.
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.replit.app",
    "*.worf.replit.dev",
    "*.picard.replit.dev",
  ],
};

export default nextConfig;

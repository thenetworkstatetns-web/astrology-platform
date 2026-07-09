/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@astro/ui", "@astro/shared", "@astro/types"],
  // Static export: this app fetches all data client-side from the Workers
  // API, so it can ship as static HTML/JS/CSS on Cloudflare Pages with no
  // server runtime required.
  output: "export",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;

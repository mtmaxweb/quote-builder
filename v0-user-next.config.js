/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  distDir: "build",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["date-fns"],
}

module.exports = nextConfig


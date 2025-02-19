/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  distDir: "build",
  assetPrefix: "/wp-content/plugins/react-quote-builder/build/",
  images: {
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Enable detailed error reporting
    config.stats = "detailed"

    if (!isServer) {
      config.output.filename = "static/js/[name].js"
      config.output.chunkFilename = "static/js/[name].chunk.js"
    }

    return config
  },
}

module.exports = nextConfig


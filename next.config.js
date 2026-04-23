const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Disables Next.js dev indicators (including stale-route / build-activity badges in `next dev`).
   * Production (`next build` + `next start`, `NODE_ENV=production`) never shows these overlays.
   */
  devIndicators: false,
  productionBrowserSourceMaps: false,

  /**
   * Explicitly declare turbopack config (even if empty) to silence Next.js 16's
   * "webpack config found but no turbopack config" WorkerError.
   */
  turbopack: {},

  /**
   * Limit build concurrency to avoid WorkerError on Vercel free tier.
   * Forces single-threaded compilation — stays within memory limits.
   */
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      { source: '/features/collaboration', destination: '/features/clients', permanent: true },
    ]
  },

  /**
   * @react-pdf/renderer (pdfkit) may resolve optional native modules; stub them for server bundles.
   * @see https://github.com/diegomura/react-pdf/issues/1095
   */
  webpack: (config, { isServer }) => {
    if (isServer) {
      const empty = path.join(__dirname, 'src', 'lib', 'shims', 'empty-module.js')
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: empty,
        encoding: empty,
      }
    }
    return config
  },
}

module.exports = nextConfig
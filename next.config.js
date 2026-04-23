const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  productionBrowserSourceMaps: false,

  turbopack: {
    resolveAlias: {
      canvas: './src/lib/shims/empty-module.js',
      encoding: './src/lib/shims/empty-module.js',
    },
  },

  // Skip TS type checking during build (SWC WASM crashes on this machine)
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      { source: '/features/collaboration', destination: '/features/clients', permanent: true },
    ]
  },

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
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true
  },

  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        './node_modules/apexcharts-clevision'
      )
    }

    return config
  },

  env: {
    API_BASE_URL: process.env.API_BASE_URL
  },

  images: {
    domains: ['localhost', '31.97.206.114', 'auction.workglyph.com']
  }
}

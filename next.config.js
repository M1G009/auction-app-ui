const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: false,
  output: 'export', // Forces Next.js to generate static files
  experimental: {
    esmExternals: false,
    jsconfigPaths: true
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Ensures Next.js finds pages inside src/pages
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL
  },
  images: {
    domains: ['localhost', '64.227.171.118'],
    unoptimized: true // Required for Firebase Hosting
  }
}

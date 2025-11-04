/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lodash'],
  },
};

module.exports = nextConfig;

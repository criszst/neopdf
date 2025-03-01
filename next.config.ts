import type { NextConfig } from "next";

const nextConfig: NextConfig = {

};

export default nextConfig;

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },

    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },

  },

  serverExternalPackages: ['@react-pdf/renderer'],

  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*', // Servir arquivos da pasta uploads
      },
    ]
  },
}


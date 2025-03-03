import type { NextConfig } from "next";
import { hostname } from "os";

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

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ]
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


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration pour éviter les problèmes de port
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Résout les problèmes de modules côté client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
  // Désactive l'optimisation des images en développement
  images: {
    unoptimized: true,
  },
  // Désactive la vérification TypeScript pendant la construction
  typescript: {
    ignoreBuildErrors: true,
  },
  // Désable la vérification ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

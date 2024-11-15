/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        canvas: false,
        zlib: false
      };
    }
    
    // Optimize PDF handling
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'file-loader'
    });

    return config;
  },
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
  // Disable tracing to avoid permission issues
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined,
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
        '.next/**/*',
      ],
    },
  }
}

module.exports = nextConfig
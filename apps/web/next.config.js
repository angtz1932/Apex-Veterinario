/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        /**
         * Redirige sub-dominios al segmento [tenant] del App Router.
         * Ejemplo: clinica1.apexvet.com/services → /clinica1/services
         * (El middleware ya extrae el tenantId; esto asegura el enrutamiento interno.)
         */
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<tenant>[^.]+)\\.apexvet\\.com',
            },
          ],
          destination: '/:tenant/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@luxora/db', '@luxora/shared'],
  serverExternalPackages: ['@prisma/client', '.prisma/client', 'bcryptjs'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  outputFileTracingIncludes: {
    '/**/*': [
      '../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**',
      '../../node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**',
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};
export default nextConfig;

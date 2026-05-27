/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@luxora/db', '@luxora/shared'],
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
};
export default nextConfig;

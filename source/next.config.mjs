const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (basePath && !/^\/[A-Za-z0-9_-]+$/.test(basePath)) throw new Error('Invalid NEXT_PUBLIC_BASE_PATH');

export default {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false
};

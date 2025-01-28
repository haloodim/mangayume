// next.config.mjs
import withMDX from '@next/mdx';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Wildcard: Mengizinkan semua domain
      },
    ],
  },
  reactStrictMode: true, // contoh konfigurasi lain, jika perlu
  // masukkan konfigurasi MDX di sini
  ...withMDX({
    extension: /\.mdx?$/,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  }),
};


export default nextConfig;

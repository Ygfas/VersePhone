/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        // You can leave port and pathname empty to allow all Unsplash images
      },
    ],
  },
};

export default nextConfig;

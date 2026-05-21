/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/**`,
      },
      // temporary addition (im tired)
      {
        protocol: 'https',
        hostname: 'national-u.edu.ph'
      }
    ]
  },
};

export default nextConfig;
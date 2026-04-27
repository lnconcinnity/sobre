/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStringMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'businessmirror.com.ph', // DLSU
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com', // UST
      },
      {
        protocol: 'https',
        hostname: 'sa.kapamilya.com', // Ateneo
      },
      {
        protocol: 'https',
        hostname: '25174313.fs1.hubspotusercontent-eu1.net', // San Beda
      },
      {
        protocol: 'https',
        hostname: 'tse1.mm.bing.net', // AU
      },
      {
        protocol: 'https',
        hostname: 'national-u.edu.ph', // NU
      },
      {
        protocol: 'https',
        hostname: 'manilasociety.com', // FEU
      },
      {
        protocol: 'https',
        hostname: 'mapua.sgp1.cdn.digitaloceanspaces.com', // Mapua
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com', // Adamson
      },
      {
        protocol: 'https',
        hostname: 'images.summitmedia-digital.com', // UP Manila
      },
      {
        protocol: 'https',
        hostname: 'www.rappler.com', // PLM
      },
      {
        protocol: 'https',
        hostname: 'mb.com.ph', // NTC
      },
      {
        protocol: 'https',
        hostname: 'smapse.com', // UP Diliman
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
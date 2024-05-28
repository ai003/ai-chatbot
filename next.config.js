/** @type {import('next').NextConfig} */
module.exports = {

  experimental: {
    serverComponentsExternalPackages: ['node-appwrite'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverComponentsExternalPackages: ['node-appwrite'],
//   },
// }
 
// module.exports = nextConfig

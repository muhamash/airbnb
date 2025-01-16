/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [ "lh3.googleusercontent.com", "a0.muscache.com", "images.unsplash.com", "a0.muscache.com", "example.com" ],
    },
    // experimental: {
    //     serverComponentsExternalPackages: [
    //         'puppeteer-core',
    //         '@sparticuz/chromium'
    //     ]
    // },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
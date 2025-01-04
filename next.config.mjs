/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "a0.muscache.com"], // Add the domain(s) you need here
    },
    // Uncomment the following line if you want to ignore TypeScript errors during the build process
    // typescript: {
    //     ignoreBuildErrors: true,
    // },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.map$/,
            use: 'ignore-loader',
        });
        return config;
    },
};

export default nextConfig;
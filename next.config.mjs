/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "a0.muscache.com"],
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.map$/,
            use: 'ignore-loader',
        });

        if (isServer) {
            config.externals = [
                ...config.externals,
                'puppeteer-core',
                'chrome-aws-lambda',
            ];
        }

        return config;
    },
};

export default nextConfig;
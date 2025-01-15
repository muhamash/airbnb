/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [ "lh3.googleusercontent.com", "a0.muscache.com", "images.unsplash.com", "a0.muscache.com", "example.com" ],
    },
    webpack: ( config, { isServer } ) =>
    {
        config.module.rules.push( {
            test: /\.map$/,
            use: 'ignore-loader',
        } );

        if ( isServer )
        {
            config.externals = [
                ...config.externals,
                'puppeteer',
                'chrome-aws-lambda',
            ];
        }

        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
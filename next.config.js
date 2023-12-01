/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    
    config.module.rules.push({
      test: /\.cdc$/,
      loader: "raw-loader",
    })

    return config;
  },
  env: {
    KINTONE_API_GW_URL: "https://c2vzsete2j.execute-api.ap-southeast-1.amazonaws.com/Test/events",
    REDIS_API_URL: "https://uk7paymj42hdddcqs76mbo7bei0oopyv.lambda-url.ap-southeast-1.on.aws/"
  }
}

module.exports = nextConfig

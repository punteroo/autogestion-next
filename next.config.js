const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: "export",
  swcMinify: false,
  // TODO: see if removing this allows to use the package normally
  webpack: (config) => {
    config.resolve.preferRelative = true;
    return config;
  },
};

module.exports = nextConfig;

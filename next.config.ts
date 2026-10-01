import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    // Product photos uploaded from the admin dashboard live on Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/dwrwaprj2/image/upload/**" }],
  },
};

export default nextConfig;

import type { NextConfig } from "next"

//no script-src explicitly set (el error persiste, headers no estan siendo definidos, npi...)
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; " +
      "frame-src https://challenges.cloudflare.com; " +
      "style-src 'self' 'unsafe-inline';",
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig


// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/:path*', 
                    has: [
                        {
                            type: 'host',
                            value: 'app.sortmyfilm.com',
                        },
                    ],
                    destination: '/app/:path*',
                }
            ],
            afterFiles: [],
            fallback: []
        }
    }
}

export default nextConfig
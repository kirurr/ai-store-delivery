import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
	turbopack: {
		resolveAlias: {
			"@shared": path.resolve(__dirname, "../shared/src")
		}
	}
};

export default nextConfig;

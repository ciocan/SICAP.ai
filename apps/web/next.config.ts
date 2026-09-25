import { withAxiom } from "next-axiom";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
	transpilePackages: ["@sicap/ui"],
	cacheComponents: false,
	cacheLife: {
		totals: {
			stale: 86400, // 24h - totals don't change frequently
			revalidate: 86400,
			expire: 604_800,
		},
		contracts: {
			stale: 2_592_000, // 30d - contracts are immutable once created
			revalidate: 2_592_000,
			expire: 2_592_000,
		},
		sitemaps: {
			stale: 43200, // 12h - sitemaps don't need frequent updates
			revalidate: 86400,
			expire: 604800,
		},
	},
	webpack(config) {
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			"@ui": path.resolve(__dirname, "../../packages/ui/src"),
			"@": path.resolve(__dirname, "./src"),
		};
		return config;
	},
	turbopack: {
		resolveAlias: {
			"@ui": "./../../packages/ui/src",
			"@": "./src",
		},
	},
	reactStrictMode: false,
	// Dev only. Caddy serves the dev server over https on the tailnet (see
	// scripts/dev/Caddyfile.devsicap); without this Next blocks its HMR and
	// /_next requests as cross-origin.
	allowedDevOrigins: ["devsicap", "devsicap.ts.sicap.ai"],
	pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
	experimental: {
		mdxRs: {
			mdxType: "gfm",
		},
	},
	async rewrites() {
		return [
			{
				source: "/ingest/:path*",
				destination: "https://eu.posthog.com/:path*",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/achizitii/firma/:id/:page(\\d{1,})",
				destination: "/achizitii/firma/:id?p=:page",
				permanent: true,
			},
			{
				source: "/achizitii/autoritate/:id/:page(\\d{1,})",
				destination: "/achizitii/autoritate/:id?p=:page",
				permanent: true,
			},
			{
				source: "/licitatii/firma/:id/:page(\\d{1,})",
				destination: "/achizitii/firma/:id?p=:page",
				permanent: true,
			},
			{
				source: "/licitatii/autoritate/:id/:page(\\d{1,})",
				destination: "/achizitii/autoritate/:id?p=:page",
				permanent: true,
			},
			{
				source: "/achizitii/:cpvId",
				destination: "/achizitii/cpv/:cpvId",
				permanent: true,
			},
			{
				source: "/licitatii/:cpvId",
				destination: "/licitatii/cpv/:cpvId",
				permanent: true,
			},
		];
	},
};

export default withAxiom(withBotId(nextConfig));

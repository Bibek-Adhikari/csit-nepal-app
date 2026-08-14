import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")
  : "https://csitnepal.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/upload", "/view-pdf"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pilu-ai.vercel.app";

// Pilu is a gated app — nearly every route requires a session (see proxy.ts's
// publicPathPrefixes) and is deliberately excluded here. Only the pages a
// crawler can actually reach without auth belong in the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/login`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/sign-up`, changeFrequency: "monthly", priority: 0.9 },
  ];
}

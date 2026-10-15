import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-url";

const siteUrl = SITE_URL;

/** Single-page portfolio — one canonical URL. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

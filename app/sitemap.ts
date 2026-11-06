import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { enabledCorePages } from "@/content/registry";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.readyForLaunch) return [];

  return [
    { url: absoluteUrl() },
    ...enabledCorePages.map((page) => ({ url: absoluteUrl(page.slug) })),
  ];
}

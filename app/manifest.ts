import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { themes } from "@/config/themes";
import { assetPath } from "@/lib/urls";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const theme = themes[siteConfig.theme.preset];
  const iconSrc = assetPath(siteConfig.assets.favicon);
  const extension = siteConfig.assets.favicon.split(/[?#]/)[0].split(".").pop()?.toLowerCase() || "";
  const imageTypes: Record<string, string> = {
    svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", gif: "image/gif", ico: "image/x-icon",
  };
  const icon = {
    src: iconSrc,
    ...(imageTypes[extension] ? { type: imageTypes[extension] } : {}),
    ...(extension === "svg" ? { sizes: "any" } : {}),
  };
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: assetPath("/"),
    display: "standalone",
    background_color: `hsl(${theme.tokens.background})`,
    theme_color: `hsl(${theme.tokens.primary})`,
    icons: [icon],
  };
}

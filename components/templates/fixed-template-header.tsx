"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import type { InternalLink } from "@/config/types";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { assetPath, routePath } from "@/lib/urls";

/** One shared Yorich-style navigation for every page, with real Next links.
 * Template snapshot's inline click handler intercepted anchors via preventDefault,
 * and template-only CSS was not reliable in the runtime screenshot. */
export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  if (!isFixedTemplate()) return null;
  const current = pathname.replace(/\/+$/, "") || "/";
  const nav = links.filter(link => link.slug.replace(/^\/+|\/+$/g, ""));
  return (
    <header className="yorich-template-header">
      <div className="yorich-template-header-inner">
        <Link href="/" className="yorich-template-brand" aria-label="Raise A Catboy home" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(siteConfig.assets.logo)} width={38} height={38} alt={siteConfig.assets.logoAlt ?? ""} />
          <strong>{siteConfig.game.name || siteConfig.shortName}</strong>
        </Link>
        <button type="button" className="yorich-template-toggle" aria-controls="yorich-primary-nav"
          aria-expanded={open} aria-label={open ? "Close guide navigation" : "Open guide navigation"}
          onClick={() => setOpen(value => !value)}>
          <span aria-hidden="true">{open ? "✕" : "☰"}</span><span>Guides</span>
        </button>
        <nav id="yorich-primary-nav" aria-label="Main guide navigation" className={`yorich-template-nav${open ? " is-open" : ""}`}>
          {nav.map(link => {
            const href = routePath(link.slug);
            const active = (href.replace(/\/+$/, "") || "/") === current;
            return <Link key={link.slug} href={href} aria-current={active ? "page" : undefined}
              className={`yorich-template-nav-item${active ? " active" : ""}`} onClick={() => setOpen(false)}>{link.label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}

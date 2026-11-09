"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { siteConfig } from "@/config/site";
import type { InternalLink } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";

const primarySlugs = new Set(["eggs", "rarities", "mutations", "codes"]);

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  const [disclosure, setDisclosure] = useState<{ menu: "guides" | "more"; path: string } | null>(null);
  const open = disclosure?.path === pathname ? disclosure.menu : null;
  const header = useRef<HTMLElement>(null);
  const guidesButton = useRef<HTMLButtonElement>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  const current = pathname.replace(/\/+$/, "") || "/";
  const nav = links.filter(link => link.slug.replace(/^\/+|\/+$/g, "")).map(link => {
    const href = routePath(link.slug);
    return { ...link, href, active: href.replace(/\/+$/, "") === current };
  });
  const primary = nav.filter(link => primarySlugs.has(link.slug));
  const more = nav.filter(link => !primarySlugs.has(link.slug));

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setDisclosure(null);
    };
    const desktop = window.matchMedia("(min-width: 841px)");
    const closeOnLayoutChange = () => setDisclosure(null);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    desktop.addEventListener("change", closeOnLayoutChange);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      desktop.removeEventListener("change", closeOnLayoutChange);
    };
  }, [open]);

  function toggle(menu: "guides" | "more") {
    setDisclosure(open === menu ? null : { menu, path: pathname });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !open) return;
    setDisclosure(null);
    (open === "guides" ? guidesButton : moreButton).current?.focus();
  }

  function renderLink(link: (typeof nav)[number]) {
    return <Link key={link.slug} href={link.href} aria-current={link.active ? "page" : undefined}
      className="yorich-template-nav-item" onClick={() => setDisclosure(null)}>{link.label}</Link>;
  }

  return (
    <header ref={header} className="yorich-template-header" onKeyDown={handleKeyDown}
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setDisclosure(null);
      }}>
      <div className="yorich-template-header-inner">
        <Link href="/" className="yorich-template-brand" aria-label="Raise A Catboy home" onClick={() => setDisclosure(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(siteConfig.assets.logo)} width={38} height={38} alt={siteConfig.assets.logoAlt ?? ""} />
          <strong>{siteConfig.game.name || siteConfig.shortName}</strong>
        </Link>
        <button ref={guidesButton} type="button" className="yorich-template-toggle" aria-controls="yorich-primary-nav"
          aria-expanded={open === "guides"} onClick={() => toggle("guides")}>
          <span aria-hidden="true">{open === "guides" ? "✕" : "☰"}</span><span>Guides</span>
        </button>
        <nav id="yorich-primary-nav" aria-label="Main guide navigation" className={`yorich-template-nav${open === "guides" ? " is-open" : ""}`}>
          {primary.map(renderLink)}
          {more.length > 0 && <div className="yorich-template-more">
            <button ref={moreButton} type="button" aria-controls="yorich-more-guides" aria-expanded={open === "more"}
              className={`yorich-template-nav-item yorich-template-more-toggle${more.some(link => link.active) ? " has-current" : ""}`}
              onClick={() => toggle("more")}>
              More <span aria-hidden="true">▾</span>
            </button>
            <div id="yorich-more-guides" className={`yorich-template-more-panel${open === "more" ? " is-open" : ""}`}>
              {more.map(renderLink)}
            </div>
          </div>}
        </nav>
      </div>
    </header>
  );
}

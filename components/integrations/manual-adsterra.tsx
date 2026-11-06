"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { manualAdsterra } from "@/config/manual-adsterra";

let socialLoaded = false;

function appendOfficialCode(target: HTMLElement, html: string) {
  const parsed = document.createElement("template");
  parsed.innerHTML = html;
  const scripts: HTMLScriptElement[] = [];

  // Native GET CODE can put its loader BEFORE its container element.
  // First create all markup; only then execute scripts in their original order.
  function mountMarkup(node: Node, parent: Node) {
    if (node instanceof HTMLScriptElement) {
      scripts.push(node);
      return;
    }
    const clone = node.cloneNode(false);
    parent.appendChild(clone);
    for (const child of Array.from(node.childNodes)) mountMarkup(child, clone);
  }
  for (const child of Array.from(parsed.content.childNodes)) mountMarkup(child, target);
  for (const original of scripts) {
    const script = document.createElement("script");
    for (const attr of Array.from(original.attributes)) {
      script.setAttribute(attr.name, attr.value);
    }
    // Preserve explicit async on Native loaders; keep inline Banner options first.
    if (original.hasAttribute("src") && !original.hasAttribute("async")) script.async = false;
    script.text = original.text;
    target.appendChild(script);
  }
}

function adSlot(type: "banner" | "native", height = 0) {
  const slot = document.createElement("div");
  slot.setAttribute("data-manual-adsterra", type);
  slot.setAttribute("aria-label", "Advertisement");
  slot.style.cssText = "width:100%;max-width:100%;margin:20px auto;text-align:center;overflow:hidden;box-sizing:border-box;";
  if (height) slot.style.minHeight = String(height + 24) + "px";
  const label = document.createElement("div");
  label.textContent = "Advertisement";
  label.style.cssText = "font-size:10px;letter-spacing:.06em;opacity:.55;margin-bottom:8px;";
  slot.appendChild(label);
  return slot;
}

function findHero(main: Element) {
  const heading = main.querySelector("h1");
  if (!heading) return null;
  // The top section containing H1 is the Hero; never split its title or CTA.
  const section = heading.closest("section, header");
  return section && main.contains(section) ? section : heading.parentElement;
}

function findFirstContent(main: Element, hero: Element) {
  const sections = Array.from(main.querySelectorAll("section, article"));
  const candidates = sections.filter((section) =>
    section !== hero && !hero.contains(section) &&
    Boolean(hero.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING) &&
    !section.closest("[data-manual-adsterra]") &&
    !section.matches("header, footer, nav")
  );
  // Short factual/meta section is preferred. Otherwise take the first real
  // complete content block, never an empty placeholder or an ad.
  const short = candidates.find((section) =>
    /facts|game.info|meta|summary|overview|stats|quick.info/i.test(String(section.className) + " " + (section.getAttribute("aria-label") || ""))
  );
  return short || candidates.find((section) =>
    ((section.textContent || "").trim().length > 25 || Boolean(section.querySelector("iframe, img, video, table, dl"))) &&
    !section.querySelector("h1")
  ) || null;
}

export function ManualAdsterra() {
  const pathname = usePathname();
  useEffect(() => {
    const code = manualAdsterra;
    if (!code.enabled) return;
    let banner: HTMLElement | null = null;
    let native: HTMLElement | null = null;
    let frame = 0;
    let media: MediaQueryList | null = null;
    let onMediaChange: (() => void) | null = null;
    const mountPageAds = () => {
      const main = document.querySelector("#main-content main") || document.querySelector("#main-content [data-arcade-surface]");
      if (!main) return;
      const hero = findHero(main);
      if (!hero) return;
      if (code.desktopBanner || code.mobileBanner) {
        const renderBanner = () => {
          banner?.remove();
          banner = null;
          const mobile = window.matchMedia("(max-width: 767px)").matches;
          const snippet = mobile ? code.mobileBanner : code.desktopBanner;
          if (!snippet) return;
          banner = adSlot("banner", mobile ? 50 : 90);
          hero.insertAdjacentElement("afterend", banner);
          appendOfficialCode(banner, snippet);
        };
        renderBanner();
        media = window.matchMedia("(max-width: 767px)");
        onMediaChange = renderBanner;
        media.addEventListener("change", onMediaChange);
      }
      if (code.nativeBanner) {
        const content = findFirstContent(main, hero);
        // Do not stack Native directly after Banner when no real content exists.
        if (content) {
          native = adSlot("native");
          content.insertAdjacentElement("afterend", native);
          appendOfficialCode(native, code.nativeBanner);
        }
      }
    };
    frame = window.requestAnimationFrame(mountPageAds);
    if (code.socialBar && !socialLoaded) {
      socialLoaded = true;
      const global = document.createElement("div");
      global.setAttribute("data-manual-adsterra", "social");
      document.body.appendChild(global);
      appendOfficialCode(global, code.socialBar);
    }
    return () => {
      window.cancelAnimationFrame(frame);
      if (media && onMediaChange) media.removeEventListener("change", onMediaChange);
      banner?.remove();
      native?.remove();
    };
  }, [pathname]);
  return null;
}

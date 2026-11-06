import {NativeAdSlot} from "@/components/integrations/native-ad-slot";
import {Faq} from "@/components/site/faq";
import {JsonLd} from "@/components/site/json-ld";
import {PageSections} from "@/components/site/page-sections";
import {siteConfig} from "@/config/site";
import {siteSkin} from "@/config/skin";
import type {HomePageDefinition} from "@/config/types";
import {homeSchemas} from "@/lib/schema";
import {assetPath,routePath} from "@/lib/urls";
import Link from "next/link";

/** Real page sections replace the specimen's demo body.
 * The previous fixed-template path emitted the mock HTML's empty H2/H3 headings
 * and unrelated demo cards before appending real sections.
 * Keep the fixed header/chrome and approved skin, but render SEO text as React. */
export function FixedTemplateHome({home}:{home:HomePageDefinition}){
  const sources=(home.sources??[]).filter(source=>{
    try{return new URL(source.url).protocol==="https:";}catch{return false;}
  }).slice(0,6);
  return <>
    <JsonLd data={homeSchemas(home)}/>
    <main className="site-container mx-auto space-y-12 py-12 sm:py-16">
      <section className="grid items-center gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div className="min-w-0">
          <p className="eyebrow">{home.hero.eyebrow}</p>
          <h1>{home.hero.heading}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8">{home.hero.lead}</p>
          {home.hero.supportingText?<p className="mt-4 leading-7">{home.hero.supportingText}</p>:null}
          <div className="mt-6 flex flex-wrap gap-3">
            {home.hero.primaryLink?<Link className="button-primary" href={routePath(home.hero.primaryLink.slug)}>{home.hero.primaryLink.label}</Link>:null}
            {siteConfig.game.officialUrl?<a className="button-secondary" href={siteConfig.game.officialUrl} target="_blank" rel="noopener noreferrer">Play on Roblox</a>:null}
          </div>
        </div>
        <div className="content-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-full rounded-theme object-cover" src={assetPath(siteConfig.assets.cover)} alt={siteConfig.assets.coverAlt ?? (siteConfig.game.name+" guide cover (illustration, not gameplay screenshot)")} />
        </div>
      </section>
      <NativeAdSlot/>
      <PageSections sections={home.sections.filter(s=>Boolean(s.heading?.trim()))}/>
      {home.screenshots.length?<section className="space-y-5">
        <h2>Game screenshots</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {home.screenshots.map(s=><figure key={s.src} className="content-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetPath(s.src)} alt={s.alt} className="w-full rounded-theme"/>
            {s.caption?<figcaption>{s.caption}</figcaption>:null}
          </figure>)}
        </div>
      </section>:null}
      {sources.length?<section className="rounded-theme border border-border p-6" aria-label="Research sources">
        <h2>Sources and verification</h2>
        <p className="mt-3 text-sm leading-7">Third-party guides are independent reports, not proof that a code is currently active. Confirm redemption in the game.</p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">
            {source.title||new URL(source.url).hostname}</a>{source.sourceType==="official"?" (Official game)":" (Third-party guide)"}</li>)}
        </ul>
      </section>:null}
      {home.faq.length?<Faq items={home.faq}/>:null}
    </main>
  </>;
}

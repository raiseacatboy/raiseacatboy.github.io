import {NativeAdSlot} from "@/components/integrations/native-ad-slot";
import {JsonLd} from "@/components/site/json-ld";
import {Faq} from "@/components/site/faq";
import {PageSections} from "@/components/site/page-sections";
import {Breadcrumbs} from "@/components/site/breadcrumbs";
import {RelatedPages} from "@/components/site/related-pages";
import {siteConfig} from "@/config/site";
import {siteSkin} from "@/config/skin";
import type {SeoPageDefinition} from "@/config/types";
import {enabledLegalPages,getRelatedPages,visibleCorePages} from "@/content/registry";
import {esc,renderFixedDocument} from "@/lib/fixed-template/render";
import {pageSchemas} from "@/lib/schema";
import {assetPath,routePath} from "@/lib/urls";
function arcadeArticle(page:SeoPageDefinition):string{
  return "<p>"+esc(page.hero.lead)+"</p>"+page.sections.filter(s=>s.heading.trim()).map(s=>
    '<section id="'+esc(s.id)+'"><h2>'+esc(s.heading)+"</h2>"+
    (s.intro?"<p>"+esc(s.intro)+"</p>":"")+
    (s.paragraphs??[]).map(p=>"<p>"+esc(p)+"</p>").join("")+"</section>"
  ).join("");
}
export function FixedTemplateInner({page}:{page:SeoPageDefinition}){
  const skin=siteSkin(),related=getRelatedPages(page);
  const sources=(page.sources??[]).filter(source=>{try{return new URL(source.url).protocol==="https:";}catch{return false;}}).slice(0,6);
  // Fixed specimen's demo article/empty headings are never included in real pages.
  return <><JsonLd data={pageSchemas(page)}/>
    <main className="site-container mx-auto space-y-12 py-12 sm:py-16">
      <section>
        <Breadcrumbs slug={page.slug} current={page.hero.heading}/>
        {page.hero.eyebrow?<p className="eyebrow">{page.hero.eyebrow}</p>:null}
        <h1>{page.hero.heading}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8">{page.hero.lead}</p>
      </section>
      <NativeAdSlot/>
      <PageSections sections={page.sections.filter(s=>Boolean(s.heading?.trim()))}/>
      {sources.length?<section className="rounded-theme border border-border p-6" aria-label="Research sources">
        <h2>Sources and verification</h2>
        <p className="mt-3 text-sm leading-7">Source dates and limitations matter on a fast-changing Roblox game. Third-party references are used as dated research aids, not as proof of unverified live mechanics.</p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="underline">{source.title||new URL(source.url).hostname}</a>{source.sourceType==="official"?" (Official game)":" (Third-party research reference)"}</li>)}
        </ul>
      </section>:null}
      {page.faq?.length?<Faq items={page.faq}/>:null}
      <RelatedPages pages={related}/>
    </main></>;
}

import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const root = process.cwd();
const output = join(root, "out");
const publicDir = join(root, "public");

writeFileSync(join(output, ".nojekyll"), "", "utf8");

const hosting = JSON.parse(readFileSync(join(root, "content/generated/site.json"), "utf8")).hosting;
const customDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN?.trim() || hosting?.customDomain || "";
if (customDomain) writeFileSync(join(output, "CNAME"), `${customDomain}\n`, "utf8");

// The static exporter prefixes /index with another /index to distinguish it
// from /. With trailingSlash it leaves the HTML and route data one level too deep.
const pages = JSON.parse(readFileSync(join(root, "content/generated/pages.json"), "utf8"));
if (pages.some(page => page.enabled && page.slug === "index")) {
  const indexDir = join(output, "index");
  const nestedDir = join(indexDir, "index");
  const files = ["index.html", "index.txt"];
  if (files.every(file => !existsSync(join(indexDir, file)) && existsSync(join(nestedDir, file)))) {
    for (const file of files) renameSync(join(nestedDir, file), join(indexDir, file));
    if (!readdirSync(nestedDir).length) rmdirSync(nestedDir);
    console.log("Corrected the static export paths for /index/.");
  }
  if (files.some(file => !existsSync(join(indexDir, file)))) {
    throw new Error("Static export is missing HTML or route data for /index/.");
  }
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const absolute = join(directory, name);
    return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
  });
}

/** Ensure infrastructure files from public/ are present at the build output root. */
function ensureTechnicalPublicFiles() {
  if (!existsSync(publicDir) || !existsSync(output)) return [];
  const copied = [];
  for (const absolute of walk(publicDir)) {
    const local = relative(publicDir, absolute).split(sep).join("/");
    const base = local.split("/").pop() || "";
    const technical = /^(robots\.txt|ads\.txt)$/i.test(base)
      || local.startsWith(".well-known/");
    if (!technical) continue;
    const target = join(output, local);
    mkdirSync(dirname(target), { recursive: true });
    if (!existsSync(target)) {
      copyFileSync(absolute, target);
      copied.push(local);
    }
  }
  return copied;
}

const ensured = ensureTechnicalPublicFiles();
console.log(
  customDomain
    ? `Static output prepared with CNAME ${customDomain}.`
    : "Static output prepared for GitHub Pages.",
);
if (ensured.length) {
  console.log(`Ensured technical public files in out/: ${ensured.join(", ")}`);
}

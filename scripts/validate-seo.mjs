import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const failures = [];

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return nested.flat();
};

const htmlFiles = (await walk(DIST_DIR)).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(DIST_DIR, file).replaceAll('\\', '/');
  const isAdmin = relative === 'admin.html' || relative.startsWith('admin/');
  const isErrorPage = relative === '404.html';

  if (!/<link rel="canonical" href="https:\/\/nguyentronghuu\.com[^"#]*" \/>/.test(html)) {
    failures.push(`${relative}: missing or invalid canonical URL`);
  }

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const [index, match] of schemas.entries()) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      failures.push(`${relative}: JSON-LD block ${index + 1} is invalid (${error.message})`);
    }
  }

  if (isAdmin || isErrorPage) {
    if (!html.includes('<meta name="robots" content="noindex, nofollow" />')) {
      failures.push(`${relative}: private/error page is not noindex`);
    }
    continue;
  }

  const rootStart = html.indexOf('<div id="root">');
  const bodyEnd = html.lastIndexOf('</body>');
  const rootHtml = rootStart >= 0 && bodyEnd > rootStart ? html.slice(rootStart, bodyEnd) : '';
  const plainText = rootHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(' ').length : 0;
  const h1Count = (rootHtml.match(/<h1(?:\s|>)/g) || []).length;

  if (!rootHtml.includes('data-prerendered="true"')) failures.push(`${relative}: full prerendered content is missing`);
  if (h1Count !== 1) failures.push(`${relative}: expected one prerendered H1, found ${h1Count}`);
  if (wordCount < 20) failures.push(`${relative}: prerendered content is too thin (${wordCount} words)`);
  if (relative.startsWith('services/') && !html.includes('"@type":"FAQPage"')) {
    failures.push(`${relative}: service page is missing FAQPage schema`);
  }
}

const sitemap = await readFile(path.join(DIST_DIR, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length < 10) failures.push(`sitemap.xml: unexpectedly contains only ${sitemapUrls.length} URLs`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) failures.push('sitemap.xml: contains duplicate URLs');

const llmsTxt = await readFile(path.join(DIST_DIR, 'llms.txt'), 'utf8');
if (!llmsTxt.includes('# Nguyễn Trọng Hữu') || !llmsTxt.includes('## Dịch vụ') || !llmsTxt.includes('## Bài viết')) {
  failures.push('llms.txt: required identity or content sections are missing');
}

if (failures.length) {
  console.error(`SEO validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length} HTML files and ${sitemapUrls.length} sitemap URLs.`);

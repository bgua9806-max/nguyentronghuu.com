import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = 'https://nguyentronghuu.com';
const SITE_NAME = 'Nguyễn Trọng Hữu';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-portrait.jpg`;
const DIST_DIR = path.resolve('dist');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const stripHtml = (value = '') => String(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const truncate = (value, max = 160) => {
  const clean = stripHtml(value);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
};

const absoluteUrl = (value) => {
  if (!value) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
};

const canonicalUrl = (route) => route === '/' ? SITE_URL : `${SITE_URL}${route}`;

const titleWithBrand = (title) => {
  const clean = stripHtml(title);
  const suffix = ` | ${SITE_NAME}`;
  if (clean.length <= 68 && clean.toLocaleLowerCase('vi').includes(SITE_NAME.toLocaleLowerCase('vi'))) return clean;
  const withoutBrand = clean.replace(/\s*[|–-]\s*Nguyễn Trọng Hữu.*$/i, '').trim();
  const available = 68 - suffix.length;
  const shortened = withoutBrand.length > available
    ? withoutBrand.slice(0, available).replace(/\s+\S*$/, '').trim()
    : withoutBrand;
  return `${shortened}${suffix}`;
};

const jsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const breadcrumbSchema = (items) => items?.length ? {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
} : null;

const routeSchema = (page) => {
  const url = canonicalUrl(page.route);
  const image = absoluteUrl(page.image);

  if (page.kind === 'article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: page.rawTitle || page.title,
      description: page.description,
      image,
      url,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      datePublished: page.publishedTime,
      dateModified: page.modifiedTime || page.publishedTime,
      articleSection: page.section,
      inLanguage: 'vi-VN',
      author: { '@type': 'Person', name: SITE_NAME, url: `${SITE_URL}/about` },
      publisher: { '@type': 'Person', name: SITE_NAME, url: SITE_URL, image: DEFAULT_IMAGE },
    };
  }

  if (page.kind === 'service') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.rawTitle || page.title,
      description: page.description,
      url,
      image,
      areaServed: { '@type': 'Country', name: 'Việt Nam' },
      provider: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
    };
  }

  if (page.kind === 'project') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: page.rawTitle || page.title,
      description: page.description,
      url,
      image,
      creator: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
      inLanguage: 'vi-VN',
    };
  }

  if (page.kind === 'profile') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: page.rawTitle || page.title,
      description: page.description,
      url,
      mainEntity: {
        '@type': 'Person',
        name: SITE_NAME,
        alternateName: 'Nguyen Trong Huu',
        url: SITE_URL,
        image: DEFAULT_IMAGE,
        jobTitle: 'AI & Technology Solutions Builder',
        sameAs: ['https://www.facebook.com/nguyentronghuu1905', 'https://zalo.me/0845555851'],
      },
    };
  }

  if (page.route === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        alternateName: 'Nguyen Trong Huu',
        url: SITE_URL,
        description: page.description,
        inLanguage: 'vi-VN',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: SITE_NAME,
        alternateName: 'Nguyen Trong Huu',
        url: SITE_URL,
        image: DEFAULT_IMAGE,
        jobTitle: 'AI & Technology Solutions Builder',
        knowsAbout: ['AI Automation', 'Web Development', 'Mobile App Development', 'System Architecture', 'Chuyển đổi số'],
        sameAs: ['https://www.facebook.com/nguyentronghuu1905', 'https://zalo.me/0845555851'],
      },
    ];
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.rawTitle || page.title,
    description: page.description,
    url,
    inLanguage: 'vi-VN',
  };
};

const buildHead = (page) => {
  const title = titleWithBrand(page.title);
  const url = canonicalUrl(page.route);
  const image = absoluteUrl(page.image);
  const robots = page.noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const schemas = [routeSchema(page), breadcrumbSchema(page.breadcrumbs)]
    .flat()
    .filter(Boolean);

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${page.kind === 'article' ? 'article' : 'website'}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="vi_VN" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    ${page.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(page.publishedTime)}" />` : ''}
    ${page.modifiedTime ? `<meta property="article:modified_time" content="${escapeHtml(page.modifiedTime)}" />` : ''}
    ${schemas.map((schema) => `<script type="application/ld+json">${jsonLd(schema)}</script>`).join('\n    ')}
  `;
};

const cleanBaseHead = (html) => html
  .replace(/\s*<title>[\s\S]*?<\/title>/gi, '')
  .replace(/\s*<meta\s+(?:name|property)=["'](?:description|author|robots|googlebot|keywords|og:[^"']+|twitter:[^"']+|article:[^"']+)["'][^>]*>/gi, '')
  .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, '')
  .replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');

const renderPage = (baseHtml, page) => {
  const heading = page.rawTitle || page.title;
  const fallback = `<!-- SEO fallback for non-JavaScript crawlers -->
    <noscript>
      <main style="max-width:760px;margin:80px auto;padding:24px;font-family:Arial,sans-serif;line-height:1.6">
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(page.description)}</p>
        ${page.route !== '/' ? `<p><a href="${SITE_URL}">Nguyễn Trọng Hữu</a></p>` : ''}
      </main>
    </noscript>`;

  return cleanBaseHead(baseHtml)
    .replace('</head>', `${buildHead(page)}\n  </head>`)
    .replace(/<!-- Noscript fallback for search engine crawlers -->[\s\S]*?<\/noscript>/i, fallback);
};

const staticPages = [
  {
    route: '/',
    title: 'Nguyễn Trọng Hữu | Giải pháp Web, App & AI Automation',
    rawTitle: 'Giải pháp công nghệ tối ưu và trải nghiệm vượt trội',
    description: 'Tư vấn và phát triển Web, Mobile App, kiến trúc hệ thống và AI Automation giúp doanh nghiệp tối ưu vận hành và tăng trưởng bền vững.',
  },
  {
    route: '/about',
    title: 'Giới thiệu Nguyễn Trọng Hữu',
    rawTitle: 'Nguyễn Trọng Hữu – Tư vấn Công nghệ & AI Automation',
    kind: 'profile',
    description: 'Tìm hiểu kinh nghiệm, năng lực và quy trình làm việc của Nguyễn Trọng Hữu trong phát triển Web, App, hệ thống và AI Automation.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Giới thiệu', url: `${SITE_URL}/about` }],
  },
  {
    route: '/services',
    title: 'Dịch vụ Web, App & AI Automation',
    rawTitle: 'Giải pháp công nghệ được thiết kế theo bài toán doanh nghiệp',
    description: 'Dịch vụ phát triển Web, Mobile App, AI Automation, kiến trúc hệ thống và tư vấn chuyển đổi số theo nhu cầu doanh nghiệp.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Dịch vụ', url: `${SITE_URL}/services` }],
  },
  {
    route: '/projects',
    title: 'Dự án Web, App & AI Automation',
    rawTitle: 'Dự án công nghệ thực tế và giá trị đo lường được',
    description: 'Các dự án Web, App, hệ thống phần mềm và tự động hóa AI do Nguyễn Trọng Hữu tư vấn và triển khai.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Dự án', url: `${SITE_URL}/projects` }],
  },
  {
    route: '/blog',
    title: 'Blog Công nghệ & AI Automation',
    rawTitle: 'Góc nhìn về Công nghệ, AI Automation và Digital Marketing',
    description: 'Bài viết thực tế về phát triển sản phẩm số, AI Automation, vận hành hệ thống, SEO và Digital Marketing.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Bài viết', url: `${SITE_URL}/blog` }],
  },
  {
    route: '/contact',
    title: 'Liên hệ tư vấn giải pháp công nghệ',
    rawTitle: 'Bắt đầu thảo luận về dự án của bạn',
    description: 'Liên hệ Nguyễn Trọng Hữu để tư vấn và triển khai Web, App, phần mềm quản trị hoặc AI Automation cho doanh nghiệp.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Liên hệ', url: `${SITE_URL}/contact` }],
  },
  {
    route: '/privacy',
    title: 'Chính sách bảo mật',
    rawTitle: 'Chính sách bảo mật',
    description: 'Chính sách bảo mật thông tin khi bạn truy cập và gửi yêu cầu tư vấn trên nguyentronghuu.com.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Chính sách bảo mật', url: `${SITE_URL}/privacy` }],
  },
  {
    route: '/terms',
    title: 'Điều khoản sử dụng',
    rawTitle: 'Điều khoản sử dụng',
    description: 'Các điều khoản áp dụng khi truy cập nội dung và sử dụng biểu mẫu liên hệ trên nguyentronghuu.com.',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Điều khoản sử dụng', url: `${SITE_URL}/terms` }],
  },
  {
    route: '/meta_ads',
    title: 'Meta Ads Analyzer – AI Workflow Skill',
    rawTitle: 'Meta Ads Analyzer',
    description: 'Bộ AI workflow giúp audit chiến dịch, phân tích creative, thiết lập tệp và đề xuất tối ưu Meta Ads có hệ thống.',
  },
];

const adminRoutes = [
  '/admin', '/admin/login', '/admin/posts', '/admin/posts/new', '/admin/projects',
  '/admin/projects/new', '/admin/services', '/admin/services/new', '/admin/contacts',
  '/admin/email', '/admin/settings',
].map((route) => ({
  route,
  title: 'Quản trị website',
  rawTitle: 'Khu vực quản trị',
  description: 'Khu vực quản trị nội bộ.',
  noIndex: true,
}));

const readEnv = async () => {
  try {
    const source = await readFile(path.resolve('.env'), 'utf8');
    return Object.fromEntries(source.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) return [];
      return [[match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]];
    }));
  } catch {
    return {};
  }
};

const fetchTable = async (env, table, query) => {
  const baseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) return [];

  const response = await fetch(`${baseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  if (!response.ok) throw new Error(`${table}: ${response.status}`);
  return response.json();
};

const dynamicPages = async () => {
  const env = await readEnv();
  try {
    const [posts, projects, services] = await Promise.all([
      fetchTable(env, 'posts', 'select=slug,title,seo_title,seo_description,excerpt,cover_image,category,created_at,updated_at&status=eq.published&order=created_at.desc'),
      fetchTable(env, 'projects', 'select=slug,title,seo_title,seo_description,cover_image,category,created_at,updated_at&status=eq.completed&order=created_at.desc'),
      fetchTable(env, 'services', 'select=slug,title,seo_title,seo_description,description,cover_image,created_at,updated_at&status=eq.published&order=created_at.desc'),
    ]);

    const postPages = posts.map((item) => ({
      route: `/blog/${item.slug}`,
      title: item.seo_title || item.title,
      rawTitle: item.title,
      description: truncate(item.seo_description || item.excerpt || `Bài viết ${item.title} của Nguyễn Trọng Hữu.`),
      image: item.cover_image,
      kind: 'article',
      section: item.category,
      publishedTime: item.created_at,
      modifiedTime: item.updated_at || item.created_at,
      lastmod: item.updated_at || item.created_at,
      breadcrumbs: [
        { name: 'Trang chủ', url: SITE_URL },
        { name: 'Bài viết', url: `${SITE_URL}/blog` },
        { name: item.title, url: `${SITE_URL}/blog/${item.slug}` },
      ],
    }));

    const projectPages = projects.map((item) => ({
      route: `/projects/${item.slug}`,
      title: item.seo_title || item.title,
      rawTitle: item.title,
      description: truncate(item.seo_description || `Dự án ${item.title} do Nguyễn Trọng Hữu triển khai.`),
      image: item.cover_image,
      kind: 'project',
      lastmod: item.updated_at || item.created_at,
      breadcrumbs: [
        { name: 'Trang chủ', url: SITE_URL },
        { name: 'Dự án', url: `${SITE_URL}/projects` },
        { name: item.title, url: `${SITE_URL}/projects/${item.slug}` },
      ],
    }));

    const servicePages = services.map((item) => ({
      route: `/services/${item.slug}`,
      title: item.seo_title || item.title,
      rawTitle: item.title,
      description: truncate(item.seo_description || item.description || `Dịch vụ ${item.title} cho doanh nghiệp.`),
      image: item.cover_image,
      kind: 'service',
      lastmod: item.updated_at || item.created_at,
      breadcrumbs: [
        { name: 'Trang chủ', url: SITE_URL },
        { name: 'Dịch vụ', url: `${SITE_URL}/services` },
        { name: item.title, url: `${SITE_URL}/services/${item.slug}` },
      ],
    }));

    return [...postPages, ...projectPages, ...servicePages];
  } catch (error) {
    console.warn(`SEO prerender skipped remote content (${error.message}). Static routes were still generated.`);
    return [];
  }
};

const outputPath = (route) => route === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, `${route.slice(1)}.html`);

const writeRoute = async (baseHtml, page) => {
  const target = outputPath(page.route);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, renderPage(baseHtml, page), 'utf8');
};

const makeSitemap = (pages) => {
  const urls = pages.filter((page) => !page.noIndex).map((page) => {
    const lastmod = page.lastmod ? `<lastmod>${escapeHtml(String(page.lastmod).slice(0, 10))}</lastmod>` : '';
    return `  <url><loc>${canonicalUrl(page.route)}</loc>${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
};

const baseHtml = await readFile(path.join(DIST_DIR, 'index.html'), 'utf8');
const remotePages = await dynamicPages();

const fallbackService = {
  route: '/services/google-sheets-automation',
  title: 'Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp',
  rawTitle: 'Tự động hóa Google Sheets & Apps Script cho Doanh nghiệp',
  description: 'Xây dựng hệ thống tự động hóa vận hành, quản lý đơn hàng, lead và báo cáo bằng Google Apps Script và Google Sheets cho doanh nghiệp.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
  kind: 'service',
  breadcrumbs: [
    { name: 'Trang chủ', url: SITE_URL },
    { name: 'Dịch vụ', url: `${SITE_URL}/services` },
    { name: 'Google Sheets Automation', url: `${SITE_URL}/services/google-sheets-automation` },
  ],
};

const publicPages = [...staticPages, ...remotePages];
if (!publicPages.some((page) => page.route === fallbackService.route)) publicPages.push(fallbackService);

for (const page of [...publicPages, ...adminRoutes]) await writeRoute(baseHtml, page);

const notFoundPage = {
  route: '/404',
  title: 'Không tìm thấy trang',
  rawTitle: 'Không tìm thấy trang',
  description: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.',
  noIndex: true,
};
await writeFile(path.join(DIST_DIR, '404.html'), renderPage(baseHtml, notFoundPage), 'utf8');
await writeFile(path.join(DIST_DIR, 'sitemap.xml'), makeSitemap(publicPages), 'utf8');
await writeFile(path.join(DIST_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`Generated SEO HTML for ${publicPages.length} public routes and ${adminRoutes.length} admin routes.`);

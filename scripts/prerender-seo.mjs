import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getServiceFaqs } from '../src/data/serviceFaqs.js';

const SITE_URL = 'https://nguyentronghuu.com';
const SITE_NAME = 'Nguyễn Trọng Hữu';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-portrait.jpg`;
const DIST_DIR = path.resolve('dist');
const CONTACT_EMAIL = 'nguyentronghuu1905@gmail.com';
const CONTACT_PHONE = '0845555851';
const FACEBOOK_URL = 'https://www.facebook.com/nguyen.trong.huu.838820/';

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

const sanitizeContentHtml = (value = '') => String(value)
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
  .replace(/\son[a-z]+\s*=\s*(["'])[\s\S]*?\1/gi, '')
  .replace(/\s(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '')
  .replace(/\\n/g, '\n');

const faqSchema = (url, faqs) => faqs?.length ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
} : null;

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
      wordCount: stripHtml(page.content).split(/\s+/).filter(Boolean).length,
      inLanguage: 'vi-VN',
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@id': `${SITE_URL}/#person` },
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
      serviceType: page.rawTitle || page.title,
      areaServed: { '@type': 'Country', name: 'Việt Nam' },
      provider: { '@id': `${SITE_URL}/#person` },
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
      creator: { '@id': `${SITE_URL}/#person` },
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
        '@id': `${SITE_URL}/#person`,
        name: SITE_NAME,
        alternateName: 'Nguyen Trong Huu',
        url: SITE_URL,
        image: DEFAULT_IMAGE,
        jobTitle: 'AI & Technology Solutions Builder',
        email: `mailto:${CONTACT_EMAIL}`,
        telephone: '+84845555851',
        sameAs: [FACEBOOK_URL, `https://zalo.me/${CONTACT_PHONE}`],
      },
    };
  }

  if (page.route === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: 'Nguyen Trong Huu',
        url: SITE_URL,
        description: page.description,
        inLanguage: 'vi-VN',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: SITE_NAME,
        alternateName: 'Nguyen Trong Huu',
        url: SITE_URL,
        image: DEFAULT_IMAGE,
        jobTitle: 'AI & Technology Solutions Builder',
        knowsAbout: ['AI Automation', 'Web Development', 'Mobile App Development', 'System Architecture', 'Chuyển đổi số'],
        email: `mailto:${CONTACT_EMAIL}`,
        telephone: '+84845555851',
        sameAs: [FACEBOOK_URL, `https://zalo.me/${CONTACT_PHONE}`],
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
  const schemas = [routeSchema(page), breadcrumbSchema(page.breadcrumbs), faqSchema(url, page.faqs)]
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

const renderCards = (items, label) => {
  const sectionId = `section-${String(label).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  return items.length ? `
  <section aria-labelledby="${sectionId}">
    <h2 id="${sectionId}">${escapeHtml(label)}</h2>
    <ul>${items.map((item) => `<li><a href="${canonicalUrl(item.route)}">${escapeHtml(item.rawTitle || item.title)}</a>${item.description ? ` — ${escapeHtml(item.description)}` : ''}</li>`).join('')}</ul>
  </section>` : '';
};

const staticPageCopy = (route) => ({
  '/': `<h2>Giải pháp tập trung vào hiệu quả vận hành</h2><p>Nguyễn Trọng Hữu tư vấn, thiết kế và triển khai website, ứng dụng, kiến trúc hệ thống và quy trình AI Automation cho doanh nghiệp Việt Nam. Mỗi giải pháp bắt đầu từ mục tiêu kinh doanh, dữ liệu và quy trình thực tế thay vì chạy theo công nghệ.</p><h2>Năng lực chính</h2><ul><li>Phát triển Web và Mobile App có khả năng mở rộng.</li><li>Tự động hóa quy trình bằng AI, n8n, Make, Google Apps Script và API.</li><li>Thiết kế kiến trúc hệ thống, dữ liệu, tracking và báo cáo.</li><li>Tư vấn chuyển đổi số, Digital Marketing và tối ưu tăng trưởng.</li></ul>`,
  '/about': `<h2>Kinh nghiệm và cách làm việc</h2><p>Nguyễn Trọng Hữu là người xây dựng giải pháp công nghệ và AI Automation, kết hợp kinh nghiệm phát triển sản phẩm số, kiến trúc hệ thống, dữ liệu và Digital Marketing. Trọng tâm công việc là biến bài toán vận hành phức tạp thành quy trình rõ ràng, có thể đo lường và bàn giao.</p><h2>Quy trình triển khai</h2><ol><li>Khảo sát mục tiêu, dữ liệu và quy trình hiện tại.</li><li>Phân tích điểm nghẽn và đề xuất kiến trúc phù hợp.</li><li>Triển khai, kiểm thử bằng dữ liệu thực tế và tối ưu.</li><li>Bàn giao tài liệu, đào tạo và thống nhất phạm vi hỗ trợ.</li></ol><h2>Lĩnh vực chuyên môn</h2><p>AI Automation, Web Development, Mobile App Development, System Architecture, Google Apps Script, n8n, Make, Supabase, PostgreSQL, SEO, CRO và Marketing Automation.</p>`,
  '/services': `<h2>Dịch vụ tư vấn và triển khai</h2><p>Các dịch vụ được thiết kế theo nhu cầu, dữ liệu, ngân sách và năng lực vận hành của từng doanh nghiệp. Phạm vi có thể bao gồm khảo sát, thiết kế giải pháp, phát triển, tích hợp API, kiểm thử, tài liệu và đào tạo bàn giao.</p>`,
  '/projects': `<h2>Dự án và kinh nghiệm triển khai</h2><p>Danh mục tập hợp các dự án Web, ứng dụng, hệ thống phần mềm và tự động hóa. Mỗi dự án trình bày phạm vi, bài toán, giải pháp và kết quả khi dữ liệu được phép công bố.</p>`,
  '/blog': `<h2>Kiến thức từ quá trình triển khai</h2><p>Blog chia sẻ hướng dẫn, phân tích và kinh nghiệm về AI Automation, phát triển sản phẩm số, kiến trúc hệ thống, SEO, dữ liệu và Digital Marketing.</p>`,
  '/contact': `<h2>Thông tin liên hệ</h2><p>Email: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Điện thoại và Zalo: <a href="tel:${CONTACT_PHONE}">${CONTACT_PHONE}</a>. Khi liên hệ, bạn nên mô tả mục tiêu, quy trình hiện tại, nguồn dữ liệu và kết quả mong muốn để nhận đề xuất sát nhu cầu.</p>`,
  '/privacy': '<h2>Phạm vi áp dụng</h2><p>Thông tin gửi qua biểu mẫu được sử dụng để phản hồi yêu cầu tư vấn, trao đổi về dự án và cải thiện trải nghiệm website. Dữ liệu không được bán cho bên thứ ba.</p>',
  '/terms': '<h2>Nguyên tắc sử dụng</h2><p>Nội dung trên website phục vụ mục đích cung cấp thông tin và tham khảo. Phạm vi, chi phí, tiến độ và trách nhiệm của mỗi dự án chỉ có hiệu lực khi được hai bên thống nhất cụ thể.</p>',
  '/editorial-policy': '<h2>Tác giả và trách nhiệm nội dung</h2><p>Nội dung chuyên môn được xuất bản dưới tên Nguyễn Trọng Hữu. Khi sử dụng số liệu hoặc tài liệu bên ngoài, bài viết ưu tiên liên kết nguồn gốc; nhận định từ quá trình triển khai được trình bày như kinh nghiệm hoặc quan điểm.</p><h2>AI trong biên tập</h2><p>Công cụ AI có thể hỗ trợ nghiên cứu, lập dàn ý hoặc rà soát cách diễn đạt. Tác giả chịu trách nhiệm kiểm tra và quyết định xuất bản cuối cùng.</p><h2>Sửa lỗi và cập nhật</h2><p>Người đọc có thể gửi URL và nội dung cần kiểm tra qua email. Bài viết hiển thị ngày cập nhật khi có thay đổi trong hệ thống quản trị.</p>',
  '/meta_ads': '<h2>Phân tích quảng cáo có hệ thống</h2><p>Meta Ads Analyzer hỗ trợ chuẩn hóa quy trình audit chiến dịch, phân tích chỉ số và creative, xác định giả thuyết tối ưu và tạo báo cáo có cấu trúc. Kết quả cần được kiểm chứng bằng dữ liệu tài khoản và mục tiêu kinh doanh thực tế.</p>',
}[route] || '');

const renderSeoContent = (page, allPages) => {
  const heading = page.rawTitle || page.title;
  if (page.noIndex) return `<main class="seo-static-shell"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(page.description)}</p></main>`;

  const published = page.publishedTime ? `<time datetime="${escapeHtml(page.publishedTime)}">Xuất bản: ${escapeHtml(String(page.publishedTime).slice(0, 10))}</time>` : '';
  const modified = page.modifiedTime ? `<time datetime="${escapeHtml(page.modifiedTime)}">Cập nhật: ${escapeHtml(String(page.modifiedTime).slice(0, 10))}</time>` : '';
  const byline = page.kind === 'article' ? `<p>Viết bởi <a rel="author" href="${SITE_URL}/about">${SITE_NAME}</a>. ${published} ${modified}</p>` : '';
  const body = page.content ? sanitizeContentHtml(page.content) : staticPageCopy(page.route);
  const transparencyNote = page.kind === 'article'
    ? `<aside><strong>Thông tin biên tập:</strong> ${SITE_NAME} chịu trách nhiệm biên tập nội dung này. <a href="${SITE_URL}/editorial-policy">Xem nguyên tắc biên tập và sử dụng nguồn</a>.</aside>`
    : page.kind === 'project'
      ? `<aside><strong>Phạm vi công bố:</strong> Tên khách hàng hoặc dữ liệu nhạy cảm có thể được khái quát; kết quả định lượng chỉ áp dụng trong phạm vi và thời gian được nêu. <a href="${SITE_URL}/editorial-policy">Xem nguyên tắc công bố</a>.</aside>`
      : '';
  const faqs = page.faqs?.length ? `<section aria-labelledby="faq-title"><h2 id="faq-title">Câu hỏi thường gặp</h2>${page.faqs.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</section>` : '';
  const childPrefix = page.route === '/' ? null : `${page.route}/`;
  const children = childPrefix ? allPages.filter((item) => item.route.startsWith(childPrefix) && item.route !== page.route) : [];
  const homeGroups = page.route === '/' ? [
    renderCards(allPages.filter((item) => item.kind === 'service').slice(0, 8), 'Dịch vụ nổi bật'),
    renderCards(allPages.filter((item) => item.kind === 'project').slice(0, 6), 'Dự án mới'),
    renderCards(allPages.filter((item) => item.kind === 'article').slice(0, 6), 'Bài viết mới'),
  ].join('') : '';
  const listing = renderCards(children, page.route === '/blog' ? 'Bài viết' : page.route === '/services' ? 'Danh sách dịch vụ' : page.route === '/projects' ? 'Danh sách dự án' : 'Nội dung liên quan');

  return `<main class="seo-static-shell" data-prerendered="true">
    <nav aria-label="Điều hướng chính"><a href="${SITE_URL}">Trang chủ</a> · <a href="${SITE_URL}/about">Giới thiệu</a> · <a href="${SITE_URL}/services">Dịch vụ</a> · <a href="${SITE_URL}/projects">Dự án</a> · <a href="${SITE_URL}/blog">Bài viết</a> · <a href="${SITE_URL}/contact">Liên hệ</a></nav>
    <article><header><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(page.description)}</p>${byline}</header>${body}${transparencyNote}</article>
    ${faqs}${listing}${homeGroups}
    <footer><p>Nguyễn Trọng Hữu · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> · <a href="tel:${CONTACT_PHONE}">${CONTACT_PHONE}</a></p></footer>
  </main>`;
};

const renderPage = (baseHtml, page, allPages) => {
  const staticContent = renderSeoContent(page, allPages);

  return cleanBaseHead(baseHtml)
    .replace('</head>', `${buildHead(page)}\n  </head>`)
    .replace(/<!-- Noscript fallback for search engine crawlers -->[\s\S]*?<\/noscript>/i, '')
    .replace('<div id="root"></div>', `<div id="root">${staticContent}</div>`);
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
    route: '/editorial-policy',
    title: 'Nguyên tắc biên tập & công bố thông tin',
    rawTitle: 'Nguyên tắc biên tập & công bố thông tin',
    description: 'Cách nội dung, số liệu, ví dụ và case study trên nguyentronghuu.com được biên soạn, kiểm tra và cập nhật.',
    lastmod: '2026-09-08',
    breadcrumbs: [{ name: 'Trang chủ', url: SITE_URL }, { name: 'Nguyên tắc biên tập', url: `${SITE_URL}/editorial-policy` }],
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
  if (!baseUrl || !anonKey) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');

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
      fetchTable(env, 'posts', 'select=slug,title,seo_title,seo_description,excerpt,content,cover_image,category,created_at,updated_at&status=eq.published&order=created_at.desc'),
      fetchTable(env, 'projects', 'select=slug,title,seo_title,seo_description,content,cover_image,category,client,year,link,created_at,updated_at&status=eq.completed&order=created_at.desc'),
      fetchTable(env, 'services', 'select=slug,title,seo_title,seo_description,description,content,cover_image,created_at,updated_at&status=eq.published&order=created_at.desc'),
    ]);

    const postPages = posts.map((item) => ({
      route: `/blog/${item.slug}`,
      title: item.seo_title || item.title,
      rawTitle: item.title,
      description: truncate(item.seo_description || item.excerpt || `Bài viết ${item.title} của Nguyễn Trọng Hữu.`),
      image: item.cover_image,
      kind: 'article',
      section: item.category,
      content: item.content,
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
      content: item.content,
      client: item.client,
      year: item.year,
      link: item.link,
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
      content: item.content,
      faqs: getServiceFaqs(item.slug),
      lastmod: item.updated_at || item.created_at,
      breadcrumbs: [
        { name: 'Trang chủ', url: SITE_URL },
        { name: 'Dịch vụ', url: `${SITE_URL}/services` },
        { name: item.title, url: `${SITE_URL}/services/${item.slug}` },
      ],
    }));

    return [...postPages, ...projectPages, ...servicePages];
  } catch (error) {
    throw new Error(`SEO prerender could not load published CMS content: ${error.message}`);
  }
};

const outputPath = (route) => route === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, `${route.slice(1)}.html`);

const writeRoute = async (baseHtml, page, allPages) => {
  const target = outputPath(page.route);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, renderPage(baseHtml, page, allPages), 'utf8');
};

const makeSitemap = (pages) => {
  const urls = pages.filter((page) => !page.noIndex).map((page) => {
    const lastmod = page.lastmod ? `<lastmod>${escapeHtml(String(page.lastmod).slice(0, 10))}</lastmod>` : '';
    return `  <url><loc>${canonicalUrl(page.route)}</loc>${lastmod}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
};

const makeLlmsTxt = (pages) => {
  const groups = [
    ['Dịch vụ', pages.filter((page) => page.kind === 'service')],
    ['Dự án', pages.filter((page) => page.kind === 'project')],
    ['Bài viết', pages.filter((page) => page.kind === 'article')],
  ];
  const sections = groups.map(([label, items]) => `## ${label}\n${items.map((page) => `- [${page.rawTitle || page.title}](${canonicalUrl(page.route)}): ${page.description}`).join('\n')}`).join('\n\n');
  return `# ${SITE_NAME}\n\n> Tư vấn và triển khai Web, App, kiến trúc hệ thống và AI Automation cho doanh nghiệp Việt Nam.\n\nThông tin chính thức: ${SITE_URL}/about\nLiên hệ: ${SITE_URL}/contact\n\n${sections}\n`;
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
  content: '<h2>Tự động hóa Google Sheets và Apps Script là gì?</h2><p>Đây là dịch vụ thiết kế hệ thống vận hành trên Google Sheets, kết hợp Apps Script, webhook và API để tự động thu thập dữ liệu, xử lý nghiệp vụ, gửi thông báo và tạo báo cáo cho doanh nghiệp.</p><h2>Phù hợp với ai?</h2><p>Giải pháp phù hợp với doanh nghiệp vừa và nhỏ đang quản lý lead, đơn hàng, báo cáo hoặc quy trình nội bộ bằng bảng tính và muốn giảm thao tác nhập liệu thủ công.</p>',
  faqs: getServiceFaqs('google-sheets-automation'),
  breadcrumbs: [
    { name: 'Trang chủ', url: SITE_URL },
    { name: 'Dịch vụ', url: `${SITE_URL}/services` },
    { name: 'Google Sheets Automation', url: `${SITE_URL}/services/google-sheets-automation` },
  ],
};

const publicPages = [...staticPages, ...remotePages];
if (!publicPages.some((page) => page.route === fallbackService.route)) publicPages.push(fallbackService);

for (const page of [...publicPages, ...adminRoutes]) await writeRoute(baseHtml, page, publicPages);

const notFoundPage = {
  route: '/404',
  title: 'Không tìm thấy trang',
  rawTitle: 'Không tìm thấy trang',
  description: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.',
  noIndex: true,
};
await writeFile(path.join(DIST_DIR, '404.html'), renderPage(baseHtml, notFoundPage, publicPages), 'utf8');
await writeFile(path.join(DIST_DIR, 'sitemap.xml'), makeSitemap(publicPages), 'utf8');
await writeFile(path.join(DIST_DIR, 'llms.txt'), makeLlmsTxt(publicPages), 'utf8');
await writeFile(path.join(DIST_DIR, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, 'utf8');

console.log(`Generated SEO HTML for ${publicPages.length} public routes and ${adminRoutes.length} admin routes.`);

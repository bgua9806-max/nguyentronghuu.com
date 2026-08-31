import React from 'react';
import { Helmet } from 'react-helmet-async';

type PageType = 'website' | 'article' | 'profile' | 'service' | 'project';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: PageType;
  image?: string;
  url?: string;
  /** Kept for compatibility with existing CMS fields; Google does not use meta keywords. */
  keywords?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  breadcrumbs?: { name: string; url: string }[];
  noIndex?: boolean;
}

const SITE_NAME = 'Nguyễn Trọng Hữu';
const SITE_URL = 'https://nguyentronghuu.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-portrait.jpg`;

function normalizeCanonical(value?: string) {
  try {
    const parsed = new URL(value || (typeof window !== 'undefined' ? window.location.pathname : '/'), SITE_URL);
    const pathname = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/+$/, '');
    return `${SITE_URL}${pathname}`;
  } catch {
    return SITE_URL;
  }
}

function absoluteImage(value?: string) {
  if (!value) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

function withBrand(title: string) {
  const clean = title.trim();
  const suffix = ` | ${SITE_NAME}`;
  if (clean.length <= 68 && clean.toLocaleLowerCase('vi').includes(SITE_NAME.toLocaleLowerCase('vi'))) return clean;
  const withoutBrand = clean.replace(/\s*[|–-]\s*Nguyễn Trọng Hữu.*$/i, '').trim();
  const available = 68 - suffix.length;
  const shortened = withoutBrand.length > available
    ? withoutBrand.slice(0, available).replace(/\s+\S*$/, '').trim()
    : withoutBrand;
  return `${shortened}${suffix}`;
}

export default function SEO({
  title,
  description,
  name = SITE_NAME,
  type = 'website',
  image,
  url,
  publishedTime,
  modifiedTime,
  articleSection,
  breadcrumbs,
  noIndex = false,
}: SEOProps) {
  const fullTitle = withBrand(title);
  const currentUrl = normalizeCanonical(url);
  const finalImage = absoluteImage(image);

  const websiteSchema = currentUrl === SITE_URL ? {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Nguyen Trong Huu',
    url: SITE_URL,
    description,
    inLanguage: 'vi-VN',
  } : null;

  const personSchema = currentUrl === SITE_URL ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    alternateName: 'Nguyen Trong Huu',
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    jobTitle: 'AI & Technology Solutions Builder',
    knowsAbout: ['AI Automation', 'Web Development', 'Mobile App Development', 'System Architecture', 'Chuyển đổi số'],
    sameAs: ['https://www.facebook.com/nguyentronghuu1905', 'https://zalo.me/0845555851'],
  } : null;

  const articleSchema = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: finalImage,
    url: currentUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': currentUrl },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    articleSection,
    inLanguage: 'vi-VN',
    author: { '@type': 'Person', name: SITE_NAME, url: `${SITE_URL}/about` },
    publisher: { '@type': 'Person', name: SITE_NAME, url: SITE_URL, image: DEFAULT_IMAGE },
  } : null;

  const serviceSchema = type === 'service' ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    url: currentUrl,
    image: finalImage,
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
    provider: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
  } : null;

  const projectSchema = type === 'project' ? {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url: currentUrl,
    image: finalImage,
    creator: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'vi-VN',
  } : null;

  const profileSchema = type === 'profile' ? {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: title,
    description,
    url: currentUrl,
    mainEntity: {
      '@type': 'Person',
      name: SITE_NAME,
      alternateName: 'Nguyen Trong Huu',
      url: SITE_URL,
      image: DEFAULT_IMAGE,
      jobTitle: 'AI & Technology Solutions Builder',
      sameAs: ['https://www.facebook.com/nguyentronghuu1905', 'https://zalo.me/0845555851'],
    },
  } : null;

  const breadcrumbSchema = breadcrumbs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: normalizeCanonical(item.url),
    })),
  } : null;

  const schemas = [websiteSchema, personSchema, articleSchema, serviceSchema, projectSchema, profileSchema, breadcrumbSchema].filter(Boolean);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={name} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={currentUrl} />
      <html lang="vi" />

      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {articleSection && <meta property="article:section" content={articleSection} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

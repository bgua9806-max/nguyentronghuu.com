import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  keywords?: string;
  /** For article pages: published date in ISO format */
  publishedTime?: string;
  /** For article pages: modified date in ISO format */
  modifiedTime?: string;
  /** For article pages: article category */
  articleSection?: string;
  /** Breadcrumb items: [{name, url}] */
  breadcrumbs?: { name: string; url: string }[];
  /** Disable indexing for this page */
  noIndex?: boolean;
}

const SITE_NAME = 'Nguyễn Trọng Hữu';
const SITE_URL = 'https://nguyentronghuu.com';
const DEFAULT_KEYWORDS = 'Nguyễn Trọng Hữu, AI Automation, Web Development, Mobile App, giải pháp công nghệ, chuyển đổi số, tư vấn công nghệ, phát triển phần mềm';

export default function SEO({ 
  title, 
  description, 
  name = SITE_NAME, 
  type = 'website', 
  image, 
  url,
  keywords,
  publishedTime,
  modifiedTime,
  articleSection,
  breadcrumbs,
  noIndex = false,
}: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME} - Người xây dựng giải pháp Công nghệ & AI`;
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const defaultImage = `${origin}/logo.png`;
  const finalImage = image ? (image.startsWith('http') ? image : `${origin}${image}`) : defaultImage;
  const finalKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  // JSON-LD: WebSite with SearchAction (helps Google show a search box in results)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Tư vấn & phát triển hệ thống nền tảng Web/App và tự động hóa AI, đồng hành chuyển đổi số và tối ưu vận hành doanh nghiệp.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // JSON-LD: Article (only for blog posts)
  const articleSchema = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: finalImage,
    url: currentUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
    ...(articleSection && { articleSection }),
  } : null;

  // JSON-LD: BreadcrumbList (helps Google show breadcrumbs in search results)
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  } : null;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={finalKeywords} />
      <meta name='author' content={name} />
      <meta name='robots' content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel='canonical' href={currentUrl} />

      {/* Language */}
      <meta httpEquiv='content-language' content='vi' />
      <html lang='vi' />

      {/* Facebook / Open Graph tags */}
      <meta property='og:type' content={type === 'article' ? 'article' : 'website'} />
      <meta property='og:site_name' content={SITE_NAME} />
      <meta property='og:locale' content='vi_VN' />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={finalImage} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:url' content={currentUrl} />
      {publishedTime && <meta property='article:published_time' content={publishedTime} />}
      {modifiedTime && <meta property='article:modified_time' content={modifiedTime} />}
      {articleSection && <meta property='article:section' content={articleSection} />}
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={finalImage} />

      {/* JSON-LD Structured Data */}
      <script type='application/ld+json'>
        {JSON.stringify(websiteSchema)}
      </script>
      {articleSchema && (
        <script type='application/ld+json'>
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type='application/ld+json'>
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

export default function SEO({ title, description, name = 'Nguyễn Trọng Hữu', type = 'website', image, url }: SEOProps) {
  const fullTitle = `${title} | Nguyễn Trọng Hữu - Chuyên gia Công nghệ & AI`;
  // The origin is necessary because og:image requires absolute URL. If window is defined we use the origin.
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const defaultImage = `${origin}/logo.png`;

  const finalImage = image ? (image.startsWith('http') ? image : `${origin}${image}`) : defaultImage;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      {/* End standard metadata tags */}
      
      {/* Facebook tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={finalImage} />
      {url && <meta property='og:url' content={url} />}
      {/* End Facebook tags */}
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content={type === 'article' ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={finalImage} />
      {/* End Twitter tags */}
    </Helmet>
  );
}

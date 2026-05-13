import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Fallback: return static sitemap
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(getStaticSitemap());
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch all published blog posts
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Fetch all projects
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, updated_at, created_at')
      .order('created_at', { ascending: false });

    const baseUrl = 'https://nguyentronghuu.com';
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Add all blog posts
    if (posts && posts.length > 0) {
      for (const post of posts) {
        const lastmod = (post.updated_at || post.created_at || today).split('T')[0];
        xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    // Add all projects
    if (projects && projects.length > 0) {
      for (const project of projects) {
        const lastmod = (project.updated_at || project.created_at || today).split('T')[0];
        xml += `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    xml += `\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(getStaticSitemap());
  }
}

function getStaticSitemap() {
  const baseUrl = 'https://nguyentronghuu.com';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/about</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/projects</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/blog</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/contact</loc><priority>0.7</priority></url>
</urlset>`;
}

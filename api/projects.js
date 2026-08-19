import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const VALID_API_KEY = process.env.ADMIN_API_KEY || process.env.VITE_ADMIN_API_KEY || 'nth_ai_agent_secret_2026';

function slugifyVietnamese(str) {
  if (!str) return '';
  let slug = str.toLowerCase();
  slug = slug.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  slug = slug.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  slug = slug.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  slug = slug.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  slug = slug.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  slug = slug.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  slug = slug.replace(/đ/g, 'd');
  slug = slug.replace(/[^a-z0-9 -]/g, '');
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/-+/g, '-');
  return slug.replace(/^\-+|\-+$/g, '');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization || req.headers['x-api-key'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (req.method !== 'GET') {
    if (!token || token !== VALID_API_KEY) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid API Key' });
    }
  }

  try {
    if (req.method === 'GET') {
      const { slug, search, limit = 10 } = req.query;
      if (slug) {
        const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }

      let query = supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(Number(limit));
      if (search) query = query.ilike('title', `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      const {
        title,
        content,
        client = 'Doanh nghiệp',
        year = new Date().getFullYear().toString(),
        link = '',
        category = 'AI AGENT',
        status = 'completed',
        cover_image = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
        tech_stack = ['React', 'TypeScript', 'Supabase', 'AI Agent'],
        seo_title,
        seo_description,
        slug
      } = req.body || {};

      if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Thiếu "title" hoặc "content"' });
      }

      let finalSlug = slug ? slugifyVietnamese(slug) : slugifyVietnamese(title);
      if (!finalSlug) finalSlug = `project-${Date.now()}`;

      const { data: existing } = await supabase.from('projects').select('id').eq('slug', finalSlug).maybeSingle();
      if (existing) finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;

      const projectPayload = {
        title,
        slug: finalSlug,
        client,
        year,
        link,
        category,
        content,
        status,
        cover_image,
        tech_stack: Array.isArray(tech_stack) ? tech_stack : [tech_stack],
        seo_title: seo_title || title,
        seo_description: seo_description || title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('projects').insert([projectPayload]).select().single();
      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Đã tạo dự án mới thành công!',
        url: `https://nguyentronghuu.com/projects/${data.slug}`,
        data
      });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, slug, ...updateFields } = req.body || {};
      updateFields.updated_at = new Date().toISOString();

      let query = supabase.from('projects').update(updateFields);
      if (id) query = query.eq('id', id);
      else if (slug) query = query.eq('slug', slug);
      else return res.status(400).json({ success: false, error: 'Cần id hoặc slug' });

      const { data, error } = await query.select().single();
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Đã cập nhật dự án!', data });
    }

    if (req.method === 'DELETE') {
      const { id, slug } = req.query || req.body || {};
      let query = supabase.from('projects').delete();
      if (id) query = query.eq('id', id);
      else if (slug) query = query.eq('slug', slug);
      else return res.status(400).json({ success: false, error: 'Cần id hoặc slug' });

      const { error } = await query;
      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Đã xóa dự án thành công.' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Projects API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Secret API Key để bảo mật API đăng bài
const VALID_API_KEY = process.env.ADMIN_API_KEY || process.env.VITE_ADMIN_API_KEY || 'nth_ai_agent_secret_2026';

// Hàm chuyển đổi tiếng Việt có dấu thành slug URL chuẩn
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
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  slug = slug.replace(/[^a-z0-9 -]/g, '');
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/-+/g, '-');
  slug = slug.replace(/^\-+|\-+$/g, '');
  return slug;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Kiểm tra xác thực (Authorization header hoặc x-api-key)
  const authHeader = req.headers.authorization || req.headers['x-api-key'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // GET có thể mở cho phép đọc, nhưng POST/PUT/DELETE bắt buộc xác thực
  if (req.method !== 'GET') {
    if (!token || token !== VALID_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Sai hoặc thiếu API Key (Cung cấp qua header Authorization: Bearer <API_KEY> hoặc x-api-key).'
      });
    }
  }

  try {
    // 1. GET: Lấy danh sách bài viết hoặc lấy 1 bài theo slug
    if (req.method === 'GET') {
      const { slug, search, limit = 10, page = 1 } = req.query;

      if (slug) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        return res.status(200).json({ success: true, data });
      }

      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const offset = (Number(page) - 1) * Number(limit);
      query = query.range(offset, offset + Number(limit) - 1);

      const { data, count, error } = await query;
      if (error) throw error;

      return res.status(200).json({
        success: true,
        total: count,
        page: Number(page),
        limit: Number(limit),
        data: data || []
      });
    }

    // 2. POST: Viết bài mới tự động từ ChatGPT / MCP
    if (req.method === 'POST') {
      const {
        title,
        content,
        excerpt,
        category = 'AI AGENT',
        tags = ['AI Automation', 'Digital Marketing'],
        cover_image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
        status = 'published',
        seo_title,
        seo_description,
        slug
      } = req.body || {};

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          error: 'Thiếu thông tin bắt buộc: "title" (tiêu đề) và "content" (nội dung HTML/Markdown).'
        });
      }

      // Tự sinh slug nếu chưa có
      let finalSlug = slug ? slugifyVietnamese(slug) : slugifyVietnamese(title);
      if (!finalSlug) {
        finalSlug = `bai-viet-${Date.now()}`;
      }

      // Kiểm tra trùng slug, nếu trùng tự thêm đuôi thời gian
      const { data: existingPost } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', finalSlug)
        .maybeSingle();

      if (existingPost) {
        finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;
      }

      // Tự sinh excerpt ngắn nếu chưa có
      const cleanText = content.replace(/<[^>]*>?/gm, '').trim();
      const finalExcerpt = excerpt || cleanText.substring(0, 160) + '...';
      const finalSeoTitle = seo_title || title;
      const finalSeoDesc = seo_description || finalExcerpt;

      const postPayload = {
        title,
        slug: finalSlug,
        content,
        excerpt: finalExcerpt,
        category: category.toUpperCase(),
        tags: Array.isArray(tags) ? tags : [tags],
        cover_image,
        status: status === 'draft' ? 'draft' : 'published',
        seo_title: finalSeoTitle,
        seo_description: finalSeoDesc,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([postPayload])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Đã tạo và đăng bài viết thành công!',
        url: `https://nguyentronghuu.com/blog/${data.slug}`,
        data
      });
    }

    // 3. PUT / PATCH: Cập nhật bài viết
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, slug, ...updateFields } = req.body || {};

      if (!id && !slug) {
        return res.status(400).json({
          success: false,
          error: 'Cần cung cấp "id" hoặc "slug" của bài viết cần cập nhật.'
        });
      }

      updateFields.updated_at = new Date().toISOString();

      let query = supabase.from('posts').update(updateFields);
      if (id) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', slug);
      }

      const { data, error } = await query.select().single();
      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Cập nhật bài viết thành công!',
        url: `https://nguyentronghuu.com/blog/${data.slug}`,
        data
      });
    }

    // 4. DELETE: Xóa bài viết
    if (req.method === 'DELETE') {
      const { id, slug } = req.query || req.body || {};

      if (!id && !slug) {
        return res.status(400).json({
          success: false,
          error: 'Cần cung cấp "id" hoặc "slug" của bài viết cần xóa.'
        });
      }

      let query = supabase.from('posts').delete();
      if (id) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', slug);
      }

      const { error } = await query;
      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Đã xóa bài viết thành công.'
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Posts Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi xử lý máy chủ'
    });
  }
}

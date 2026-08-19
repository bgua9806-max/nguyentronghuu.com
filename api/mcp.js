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

const MCP_TOOLS = [
  {
    name: 'create_post',
    description: 'Tự động tạo và đăng bài viết chuẩn SEO lên website nguyentronghuu.com',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Tiêu đề bài viết (hấp dẫn, chuẩn SEO)' },
        content: { type: 'string', description: 'Nội dung bài viết đầy đủ định dạng HTML (h2, h3, p, ul, li, strong, blockquote)' },
        excerpt: { type: 'string', description: 'Tóm tắt ngắn gọn bài viết (1-2 câu ngắn)' },
        category: { type: 'string', description: 'Chuyên mục bài viết: AI AGENT, MARKETING, CONVERSION RATE, CONTENT STRATEGY' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Danh sách thẻ từ khóa' },
        cover_image: { type: 'string', description: 'Link ảnh đại diện bài viết' },
        status: { type: 'string', enum: ['published', 'draft'], description: 'Trạng thái bài: published (xuất bản) hoặc draft (nháp)' },
        seo_title: { type: 'string', description: 'Tiêu đề thẻ Meta Title SEO' },
        seo_description: { type: 'string', description: 'Mô tả Meta Description SEO' }
      },
      required: ['title', 'content']
    }
  },
  {
    name: 'get_posts',
    description: 'Lấy danh sách các bài viết hiện có trên nguyentronghuu.com để tham khảo hoặc kiểm tra chủ đề',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Từ khóa tìm kiếm theo tiêu đề' },
        limit: { type: 'number', description: 'Số lượng bài cần lấy (mặc định: 10)' }
      }
    }
  },
  {
    name: 'update_post',
    description: 'Cập nhật nội dung hoặc thông tin của một bài viết theo slug hoặc ID',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Slug định danh của bài viết' },
        title: { type: 'string', description: 'Tiêu đề mới' },
        content: { type: 'string', description: 'Nội dung HTML mới' },
        status: { type: 'string', enum: ['published', 'draft'], description: 'Trạng thái bài viết' }
      },
      required: ['slug']
    }
  },
  {
    name: 'delete_post',
    description: 'Xóa một bài viết khỏi website theo slug',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Slug của bài viết cần xóa' }
      },
      required: ['slug']
    }
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization || req.headers['x-api-key'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  // Xác thực API Key
  if (token !== VALID_API_KEY && req.query.apiKey !== VALID_API_KEY) {
    return res.status(401).json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Unauthorized: Invalid API Key' },
      id: req.body?.id || null
    });
  }

  const { method, params, id } = req.body || {};

  try {
    // 1. Khởi tạo MCP handshake
    if (method === 'initialize') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'nguyentronghuu-mcp-server',
            version: '1.0.0'
          }
        }
      });
    }

    // 2. Danh sách công cụ (Tools List)
    if (method === 'tools/list') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS
        }
      });
    }

    // 3. Thực thi công cụ (Tools Call)
    if (method === 'tools/call') {
      const { name: toolName, arguments: args } = params || {};

      if (toolName === 'create_post') {
        const {
          title,
          content,
          excerpt,
          category = 'AI AGENT',
          tags = ['AI Automation', 'Digital Marketing'],
          cover_image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
          status = 'published',
          seo_title,
          seo_description
        } = args;

        let finalSlug = slugifyVietnamese(title) || `post-${Date.now()}`;
        const { data: existing } = await supabase.from('posts').select('id').eq('slug', finalSlug).maybeSingle();
        if (existing) finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;

        const cleanText = content.replace(/<[^>]*>?/gm, '').trim();
        const finalExcerpt = excerpt || cleanText.substring(0, 160) + '...';

        const postPayload = {
          title,
          slug: finalSlug,
          content,
          excerpt: finalExcerpt,
          category: category.toUpperCase(),
          tags: Array.isArray(tags) ? tags : [tags],
          cover_image,
          status: status === 'draft' ? 'draft' : 'published',
          seo_title: seo_title || title,
          seo_description: seo_description || finalExcerpt,
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('posts').insert([postPayload]).select().single();
        if (error) throw error;

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `✅ Đã đăng bài viết thành công lên website!\n\n📌 Tiêu đề: ${data.title}\n🔗 Link bài viết: https://nguyentronghuu.com/blog/${data.slug}\n🏷️ Chuyên mục: ${data.category}\n🟢 Trạng thái: ${data.status}`
              }
            ]
          }
        });
      }

      if (toolName === 'get_posts') {
        const { search, limit = 10 } = args || {};
        let query = supabase.from('posts').select('id, title, slug, category, status, created_at').order('created_at', { ascending: false }).limit(limit);
        if (search) query = query.ilike('title', `%${search}%`);

        const { data, error } = await query;
        if (error) throw error;

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2)
              }
            ]
          }
        });
      }

      if (toolName === 'update_post') {
        const { slug, ...updateFields } = args;
        updateFields.updated_at = new Date().toISOString();

        const { data, error } = await supabase.from('posts').update(updateFields).eq('slug', slug).select().single();
        if (error) throw error;

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `✅ Đã cập nhật bài viết "${data.title}" thành công!\n🔗 Link: https://nguyentronghuu.com/blog/${data.slug}`
              }
            ]
          }
        });
      }

      if (toolName === 'delete_post') {
        const { slug } = args;
        const { error } = await supabase.from('posts').delete().eq('slug', slug);
        if (error) throw error;

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `✅ Đã xóa bài viết "${slug}" khỏi hệ thống.`
              }
            ]
          }
        });
      }

      return res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32601, message: `Tool "${toolName}" not found` },
        id
      });
    }

    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Invalid Request method' },
      id
    });
  } catch (error) {
    console.error('MCP Error:', error);
    return res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: error.message || 'Internal Server Error' },
      id
    });
  }
}

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
  // --- BÀI VIẾT (POSTS) ---
  {
    name: 'create_post',
    description: 'Tự động tạo và xuất bản bài viết chuẩn SEO lên website nguyentronghuu.com/blog',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Tiêu đề bài viết (hấp dẫn, chuẩn SEO)' },
        content: { type: 'string', description: 'Nội dung bài viết đầy đủ định dạng HTML (h2, h3, p, ul, li, strong, blockquote)' },
        excerpt: { type: 'string', description: 'Tóm tắt ngắn gọn bài viết (1-2 câu)' },
        category: { 
          type: 'string', 
          description: 'Chuyên mục bài viết: AI AGENT, MARKETING, CONVERSION RATE, CONTENT STRATEGY',
          enum: ['AI AGENT', 'MARKETING', 'CONVERSION RATE', 'CONTENT STRATEGY']
        },
        tags: { type: 'array', items: { type: 'string' }, description: 'Danh sách thẻ từ khóa' },
        cover_image: { type: 'string', description: 'Link ảnh đại diện bài viết' },
        status: { type: 'string', enum: ['published', 'draft'], description: 'Trạng thái: published hoặc draft' }
      },
      required: ['title', 'content']
    }
  },
  {
    name: 'get_posts',
    description: 'Lấy danh sách các bài viết hiện có trên nguyentronghuu.com',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Từ khóa tìm kiếm theo tiêu đề' },
        limit: { type: 'number', description: 'Số lượng bài cần lấy (mặc định: 10)' }
      }
    }
  },

  // --- DỰ ÁN (PROJECTS) ---
  {
    name: 'create_project',
    description: 'Tự động tạo và xuất bản hồ sơ dự án case study lên nguyentronghuu.com/projects',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Tên dự án case study (ví dụ: AI Automation cho Chuỗi Nhà Hàng F&B)' },
        client: { type: 'string', description: 'Tên khách hàng / doanh nghiệp đối tác' },
        year: { type: 'string', description: 'Năm triển khai (ví dụ: 2026)' },
        category: { type: 'string', description: 'Lĩnh vực dự án (AI AGENT, E-COMMERCE, SAAS, MOBILE APP)' },
        content: { type: 'string', description: 'Chi tiết case study: Bối cảnh, Thách thức, Giải pháp AI, Kết quả đạt được (HTML)' },
        tech_stack: { type: 'array', items: { type: 'string' }, description: 'Công nghệ sử dụng (ví dụ: [React, Python, Supabase, n8n, LLM])' },
        cover_image: { type: 'string', description: 'Link ảnh bìa dự án' },
        link: { type: 'string', description: 'Link website hoặc bản demo thực tế' }
      },
      required: ['title', 'content']
    }
  },
  {
    name: 'get_projects',
    description: 'Lấy danh sách các dự án case study hiện có trên website',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Số lượng dự án cần lấy (mặc định: 10)' }
      }
    }
  },

  // --- DỊCH VỤ (SERVICES) ---
  {
    name: 'create_service',
    description: 'Tự động tạo gói dịch vụ tư vấn và giải pháp công nghệ mới lên nguyentronghuu.com/services',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Tên gói dịch vụ (ví dụ: Dịch vụ Xây dựng AI Agent Tự Vận Hành)' },
        description: { type: 'string', description: 'Mô tả ngắn gọn giá trị mang lại cho doanh nghiệp' },
        content: { type: 'string', description: 'Nội dung chi tiết dịch vụ, phạm vi công việc, quy trình triển khai, deliverables, FAQ (HTML)' },
        icon_name: { type: 'string', description: 'Tên icon hiển thị (Bot, Cpu, Code2, LineChart, Shield)' },
        cover_image: { type: 'string', description: 'Link ảnh bìa dịch vụ' }
      },
      required: ['title', 'content']
    }
  },
  {
    name: 'get_services',
    description: 'Lấy danh sách các gói dịch vụ hiện có trên website',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Số lượng dịch vụ cần lấy (mặc định: 10)' }
      }
    }
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    const sessionId = Date.now().toString();
    const host = req.headers.host || 'nguyentronghuu.com';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    res.write(`event: endpoint\ndata: ${protocol}://${host}/api/mcp?sessionId=${sessionId}\n\n`);
    return res.end();
  }

  const { method, params, id } = req.body || {};

  try {
    if (method === 'ping' || method === 'notifications/initialized') {
      return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
    }

    if (method === 'initialize') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'nguyentronghuu-mcp-server', version: '1.2.0' }
        }
      });
    }

    if (method === 'tools/list') {
      return res.status(200).json({
        jsonrpc: '2.0',
        id,
        result: { tools: MCP_TOOLS }
      });
    }

    if (method === 'tools/call') {
      const { name: toolName, arguments: args } = params || {};

      // 1. CREATE POST
      if (toolName === 'create_post') {
        const { title, content, excerpt, category = 'AI AGENT', tags = ['AI'], cover_image, status = 'published' } = args || {};
        let finalSlug = slugifyVietnamese(title) || `post-${Date.now()}`;
        const { data: existing } = await supabase.from('posts').select('id').eq('slug', finalSlug).maybeSingle();
        if (existing) finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;

        const cleanText = (content || '').replace(/<[^>]*>?/gm, '').trim();
        const postPayload = {
          title,
          slug: finalSlug,
          content,
          excerpt: excerpt || cleanText.substring(0, 160) + '...',
          category: (category || 'AI AGENT').toUpperCase(),
          tags: Array.isArray(tags) ? tags : [tags || 'AI'],
          cover_image: cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
          status: status === 'draft' ? 'draft' : 'published',
          seo_title: title,
          seo_description: excerpt || cleanText.substring(0, 160),
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
            content: [{ type: 'text', text: `✅ Đã đăng bài viết: ${data.title}\n🔗 Link: https://nguyentronghuu.com/blog/${data.slug}` }]
          }
        });
      }

      // 2. GET POSTS
      if (toolName === 'get_posts') {
        const { search, limit = 10 } = args || {};
        let query = supabase.from('posts').select('id, title, slug, category, status, created_at').order('created_at', { ascending: false }).limit(limit);
        if (search) query = query.ilike('title', `%${search}%`);
        const { data, error } = await query;
        if (error) throw error;
        return res.status(200).json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] } });
      }

      // 3. CREATE PROJECT
      if (toolName === 'create_project') {
        const { title, client = 'Doanh nghiệp', year = '2026', category = 'AI AGENT', content, tech_stack = ['AI Agent', 'React'], cover_image, link = '' } = args || {};
        let finalSlug = slugifyVietnamese(title) || `project-${Date.now()}`;
        const { data: existing } = await supabase.from('projects').select('id').eq('slug', finalSlug).maybeSingle();
        if (existing) finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;

        const payload = {
          title,
          slug: finalSlug,
          client,
          year,
          category,
          content,
          link,
          status: 'completed',
          cover_image: cover_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
          tech_stack: Array.isArray(tech_stack) ? tech_stack : [tech_stack],
          seo_title: title,
          seo_description: title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('projects').insert([payload]).select().single();
        if (error) throw error;

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `✅ Đã tạo dự án mới: ${data.title}\n🔗 Link: https://nguyentronghuu.com/projects/${data.slug}` }]
          }
        });
      }

      // 4. GET PROJECTS
      if (toolName === 'get_projects') {
        const { limit = 10 } = args || {};
        const { data, error } = await supabase.from('projects').select('id, title, slug, client, year, category').order('created_at', { ascending: false }).limit(limit);
        if (error) throw error;
        return res.status(200).json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] } });
      }

      // 5. CREATE SERVICE
      if (toolName === 'create_service') {
        const { title, description, content, icon_name = 'Bot', cover_image } = args || {};
        let finalSlug = slugifyVietnamese(title) || `service-${Date.now()}`;
        const { data: existing } = await supabase.from('services').select('id').eq('slug', finalSlug).maybeSingle();
        if (existing) finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;

        const payload = {
          title,
          slug: finalSlug,
          description: description || title,
          content,
          icon_name,
          cover_image: cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
          status: 'published',
          seo_title: title,
          seo_description: description || title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase.from('services').insert([payload]).select().single();
        if (error) throw error;

        return res.status(200).json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `✅ Đã tạo gói dịch vụ mới: ${data.title}\n🔗 Link: https://nguyentronghuu.com/services/${data.slug}` }]
          }
        });
      }

      // 6. GET SERVICES
      if (toolName === 'get_services') {
        const { limit = 10 } = args || {};
        const { data, error } = await supabase.from('services').select('id, title, slug, description, status').order('created_at', { ascending: false }).limit(limit);
        if (error) throw error;
        return res.status(200).json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] } });
      }

      return res.status(404).json({
        jsonrpc: '2.0',
        error: { code: -32601, message: `Tool "${toolName}" not found` },
        id
      });
    }

    return res.status(200).json({ jsonrpc: '2.0', id, result: { status: 'ok' } });
  } catch (error) {
    console.error('MCP Error:', error);
    return res.status(500).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: error.message || 'Internal Server Error' },
      id
    });
  }
}

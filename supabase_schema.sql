-- 1. Create table cho Bài Viết (Posts)
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  seo_title text,
  seo_description text,
  category text,
  status text DEFAULT 'published',
  views integer DEFAULT 0,
  cover_image text,
  tags text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table cho Dự Án (Projects)
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client text,
  year text,
  link text,
  category text,
  content text,
  seo_title text,
  seo_description text,
  status text DEFAULT 'completed',
  cover_image text,
  tech_stack text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Cấu hình bảo mật RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả mọi người đọc (SELECT) các bài viết/dự án đã xuất bản
CREATE POLICY "Public posts are viewable by everyone." ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (status = 'completed');

-- Tạm thời cho phép tất cả các thao tác (Insert/Update/Delete) trên Client 
-- (Để thuận tiện phát triển ban đầu, sau này làm xong tính năng Đăng nhập Admin thì sẽ khóa lại)
CREATE POLICY "Allow all operations for now on posts" ON posts FOR ALL USING (true);
CREATE POLICY "Allow all operations for now on projects" ON projects FOR ALL USING (true);

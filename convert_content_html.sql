-- =============================================
-- Chuyển đổi nội dung plain text → HTML
-- Chạy 1 lần duy nhất trên Supabase SQL Editor
-- =============================================

-- Bước 1: Tạo function chuyển đổi
CREATE OR REPLACE FUNCTION convert_text_to_html(raw_text TEXT)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  lines TEXT[];
  line TEXT;
  in_list BOOLEAN := FALSE;
  list_type TEXT := '';
BEGIN
  IF raw_text IS NULL OR raw_text = '' THEN
    RETURN raw_text;
  END IF;

  -- Nếu đã có thẻ HTML thì bỏ qua
  IF raw_text LIKE '%<p>%' OR raw_text LIKE '%<h2>%' OR raw_text LIKE '%<br>%' THEN
    RETURN raw_text;
  END IF;

  result := '';
  lines := string_to_array(raw_text, E'\n');

  FOR i IN 1..array_length(lines, 1) LOOP
    line := trim(lines[i]);

    -- Dòng trống → đóng list nếu đang mở, thêm khoảng cách
    IF line = '' THEN
      IF in_list THEN
        IF list_type = 'ul' THEN result := result || '</ul>'; END IF;
        IF list_type = 'ol' THEN result := result || '</ol>'; END IF;
        in_list := FALSE;
      END IF;
      CONTINUE;
    END IF;

    -- Chuyển **text** → <strong>text</strong>
    line := regexp_replace(line, '\*\*([^*]+)\*\*', '<strong>\1</strong>', 'g');
    -- Chuyển ''text'' → <em>text</em>  
    line := regexp_replace(line, '''([^'']+)''', '<em>\1</em>', 'g');

    -- Bullet list: - item
    IF line ~ '^\- ' THEN
      IF NOT in_list OR list_type != 'ul' THEN
        IF in_list THEN
          IF list_type = 'ol' THEN result := result || '</ol>'; END IF;
        END IF;
        result := result || '<ul>';
        in_list := TRUE;
        list_type := 'ul';
      END IF;
      result := result || '<li>' || substring(line from 3) || '</li>';
      CONTINUE;
    END IF;

    -- Numbered list: 1. item
    IF line ~ '^\d+\.\s' THEN
      IF NOT in_list OR list_type != 'ol' THEN
        IF in_list THEN
          IF list_type = 'ul' THEN result := result || '</ul>'; END IF;
        END IF;
        result := result || '<ol>';
        in_list := TRUE;
        list_type := 'ol';
      END IF;
      result := result || '<li>' || regexp_replace(line, '^\d+\.\s*', '') || '</li>';
      CONTINUE;
    END IF;

    -- Đóng list nếu dòng không phải list
    IF in_list THEN
      IF list_type = 'ul' THEN result := result || '</ul>'; END IF;
      IF list_type = 'ol' THEN result := result || '</ol>'; END IF;
      in_list := FALSE;
    END IF;

    -- Heading nếu dòng kết thúc bằng : và ngắn
    IF line LIKE '%:' AND length(line) < 80 AND line LIKE '<strong>%' THEN
      line := regexp_replace(line, '<strong>', '');
      line := regexp_replace(line, '</strong>', '');
      line := regexp_replace(line, ':$', '');
      result := result || '<h3>' || line || '</h3>';
      CONTINUE;
    END IF;

    -- Paragraph bình thường
    result := result || '<p>' || line || '</p>';
  END LOOP;

  -- Đóng list cuối cùng nếu còn mở
  IF in_list THEN
    IF list_type = 'ul' THEN result := result || '</ul>'; END IF;
    IF list_type = 'ol' THEN result := result || '</ol>'; END IF;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Bước 2: Cập nhật toàn bộ bài viết
UPDATE posts
SET content = convert_text_to_html(content)
WHERE content IS NOT NULL
  AND content != ''
  AND content NOT LIKE '%<p>%'
  AND content NOT LIKE '%<h3>%';

-- Bước 3: Cập nhật toàn bộ dự án
UPDATE projects
SET content = convert_text_to_html(content)
WHERE content IS NOT NULL
  AND content != ''
  AND content NOT LIKE '%<p>%'
  AND content NOT LIKE '%<h3>%';

-- Bước 4: Xóa function tạm
DROP FUNCTION IF EXISTS convert_text_to_html(TEXT);

-- Kiểm tra kết quả
SELECT id, title, LEFT(content, 100) AS content_preview FROM posts LIMIT 5;
SELECT id, title, LEFT(content, 100) AS content_preview FROM projects LIMIT 5;

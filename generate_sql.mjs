import fs from 'fs';

try {
  const code = fs.readFileSync('./src/data.ts', 'utf-8');
  const transformedCode = code.replace(/export const/g, 'const') + '\n\nreturn { BLOG_POSTS, PROJECTS_DATA };';
  const { BLOG_POSTS, PROJECTS_DATA } = new Function(transformedCode)();

  function escapeSql(str) {
    if (!str) return '';
    return str.replace(/'/g, "''");
  }

  let sql = '-- Nhập dữ liệu Bài viết (Posts)\nINSERT INTO posts (title, slug, category, content, excerpt, cover_image, status) VALUES\n';

  const postValues = BLOG_POSTS.map(p => {
    const slug = p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const excerpt = p.content.substring(0, 150) + '...';
    return `('${escapeSql(p.title)}', '${slug}', '${escapeSql(p.category)}', '${escapeSql(p.content)}', '${escapeSql(excerpt)}', '${escapeSql(p.img)}', 'published')`;
  });

  sql += postValues.join(',\n') + ';\n\n';

  sql += '-- Nhập dữ liệu Dự án (Projects)\nINSERT INTO projects (title, slug, client, year, category, content, seo_description, cover_image, status) VALUES\n';

  const projectValues = PROJECTS_DATA.map(p => {
    const slug = p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const content = `**Thách thức:**\n${p.challenge}\n\n**Giải pháp:**\n${p.solution}\n\n**Kết quả đạt được:**\n${p.results ? p.results.map(r => '- ' + r).join('\n') : ''}`;
    return `('${escapeSql(p.title)}', '${slug}', '${escapeSql(p.client)}', '${escapeSql(p.year)}', '${escapeSql(p.category)}', '${escapeSql(content)}', '${escapeSql(p.description)}', '${escapeSql(p.img)}', 'completed')`;
  });

  sql += projectValues.join(',\n') + ';\n';

  fs.writeFileSync('insert_data.sql', sql);
  console.log('Đã tạo thành công file insert_data.sql');
} catch (error) {
  console.error('Error generating SQL:', error);
}

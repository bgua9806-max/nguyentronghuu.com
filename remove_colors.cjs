const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/admin/Dashboard.tsx',
  'src/pages/admin/BlogManager.tsx',
  'src/pages/admin/ProjectManager.tsx',
  'src/pages/admin/PostEditor.tsx',
  'src/pages/admin/Settings.tsx'
];

files.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove max-w
  content = content.replace(/mx-auto max-w-5xl/g, 'w-full max-w-none');
  
  // Dashboard trends
  content = content.replace(/bg-emerald-50 text-emerald-600/g, 'bg-zinc-100 text-zinc-900');
  content = content.replace(/bg-red-50 text-red-600/g, 'bg-zinc-50 text-zinc-500');
  
  // BlogManager & ProjectManager Status Badges
  content = content.replace(/bg-emerald-50 text-emerald-600 border-emerald-100/g, 'bg-zinc-100 text-zinc-900 border-zinc-200 shadow-sm');
  content = content.replace(/bg-amber-50 text-amber-600 border-amber-100/g, 'bg-zinc-50 text-zinc-600 border-zinc-200 shadow-sm');
  content = content.replace(/bg-blue-50 text-blue-600 border-blue-100/g, 'bg-zinc-50 text-zinc-500 border-zinc-200 shadow-sm');
  
  // Also specific string replacements:
  content = content.replace(/text-emerald-600 border border-emerald-100/g, 'text-zinc-900 border border-zinc-200 shadow-sm');
  content = content.replace(/bg-emerald-50/g, 'bg-zinc-100');

  // Action button hovers
  content = content.replace(/hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600/g, 'hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950');
  content = content.replace(/hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600/g, 'hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950');
  content = content.replace(/hover:border-red-500 hover:bg-red-50 hover:text-red-600/g, 'hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950');
  content = content.replace(/hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600/g, 'hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950');

  // Specific Post Editor
  content = content.replace(/bg-blue-500\/20 text-blue-400/g, 'bg-zinc-800 text-zinc-300');

  fs.writeFileSync(fullPath, content, 'utf8');
});

const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/layouts/AdminLayout.tsx',
  'src/pages/admin/Dashboard.tsx',
  'src/pages/admin/BlogManager.tsx',
  'src/pages/admin/ProjectManager.tsx',
  'src/pages/admin/PostEditor.tsx',
  'src/pages/admin/Settings.tsx',
];

const replacements = {
  'rounded-md': 'rounded-sm',
};

for (const relPath of filesToProcess) {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the strings
    for (const [oldClass, newClass] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
      content = content.replace(regex, newClass);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${relPath}`);
  } else {
    console.warn(`File not found: ${relPath}`);
  }
}

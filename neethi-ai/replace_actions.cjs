const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir, { recursive: true })
  .filter(f => f.endsWith('.jsx') || f.endsWith('.tsx'))
  .map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We want to replace the `div className="flex items-center gap-4"` block inside the header.
  // We can use a regex to match the start of the block and the end of it.
  // Basically, from `<div className="flex items-center gap-4">` up to `</header>`.
  
  // Wait, some have an admin badge inside the gap-4 div, before the Bell button.
  // The Bell button starts with `<button className="relative p-1">` or `<button className="p-1">` for bell (wait, bell is relative).
  
  // Let's replace the whole `div className="flex items-center gap-4"` that contains Bell, HelpCircle, User.
  // regex: /<div className="flex items-center gap-4">([\s\S]*?)<User className="w-4 h-4 text-slate-600" \/>\s*<\/div>\s*<\/div>/g
  // A simpler way is to match from `<div className="flex items-center gap-4">` until we see `</header>`, but wait, the `</div>` closes the flex container, then `</header>` comes next.

  // Let's use a simpler string matching/replacement.
  const regex = /<div className="flex items-center gap-4">\s*(<div[^>]*>[\s\S]*?<\/div>\s*)?<button[\s\S]*?<Bell[\s\S]*?<\/button>\s*<button[\s\S]*?<HelpCircle[\s\S]*?<\/button>\s*<div[\s\S]*?<User[\s\S]*?<\/div>\s*<\/div>/g;

  content = content.replace(regex, (match, adminBadge) => {
    console.log(`Replacing in ${file}`);
    if (adminBadge) {
      return `<TopNavActions>\n          ${adminBadge.trim()}\n        </TopNavActions>`;
    }
    return `<TopNavActions />`;
  });

  if (content !== originalContent) {
    // Add import statement for TopNavActions
    const importTopNav = `import TopNavActions from '../components/TopNavActions'`;
    const importTopNavDeep = `import TopNavActions from '../../components/TopNavActions'`;
    
    const isDeep = file.split('/').length > 3; // e.g. src/pages/wizard/Step1.jsx
    const importStr = isDeep ? importTopNavDeep : importTopNav;

    // Insert import after the last import statement
    if (!content.includes('TopNavActions')) {
      const importMatches = content.match(/^import .*$/gm);
      if (importMatches) {
        const lastImport = importMatches[importMatches.length - 1];
        content = content.replace(lastImport, `${lastImport}\n${importStr}`);
      }
    }

    fs.writeFileSync(file, content);
  }
});

console.log('Done.');

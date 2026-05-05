const fs = require('fs');
const path = require('path');

const files = [
  'OfficerDashboard.tsx',
  'VerdictDashboard.tsx',
  'AuditTrail.tsx',
  'Analytics.tsx',
  'Settings.tsx',
  'BidDetails.tsx',
  'KtppReport.tsx'
];

files.forEach(fileName => {
  const file = path.join(__dirname, 'src', 'pages', fileName);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // For OfficerDashboard and Analytics which have the name/department info:
  // <div className="text-right hidden sm:block">
  //   <p className="text-sm font-bold text-slate-900 leading-none">{CURRENT_USER.name}</p>
  // ...
  // </div>
  const userBlockRegex = /<div className="text-right hidden sm:block">[\s\S]*?<\/div>/;
  const userBlockMatch = content.match(userBlockRegex);
  const userBlockStr = userBlockMatch ? `<div className="text-right hidden sm:block mr-2">\n${userBlockMatch[0].split('\n').slice(1).join('\n')}` : '';

  // We want to replace everything from `<div className="flex items-center gap-` (or similar) that contains the Bell/Help/User/LogOut until `</div>\n      </header>`
  // Let's just find `</header>` and replace the div just before it.
  
  // A safe regex: Match `<div className="flex items-center gap-` followed by anything, ending with `</header>`
  const headerActionsRegex = /<div className="flex items-center gap-[^>]*>[\s\S]*?<\/header>/;
  
  content = content.replace(headerActionsRegex, (match) => {
    let extra = '';
    if (match.includes('CURRENT_USER.name')) {
      // it has the user info block, which we extracted
      extra = `\n            ${userBlockStr.trim()}`;
    }
    
    return `<TopNavActions>${extra ? extra + '\n          ' : ''}</TopNavActions>\n        </div>\n      </header>`;
  });

  if (content !== originalContent) {
    const importTopNav = `import TopNavActions from '../components/TopNavActions'`;
    
    if (!content.includes('TopNavActions')) {
      const importMatches = content.match(/^import .*$/gm);
      if (importMatches) {
        const lastImport = importMatches[importMatches.length - 1];
        content = content.replace(lastImport, `${lastImport}\n${importTopNav}`);
      }
    }

    fs.writeFileSync(file, content);
    console.log(`Replaced in ${fileName}`);
  }
});

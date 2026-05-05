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

files.forEach(f => {
  const file = path.join(__dirname, 'src', 'pages', f);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('import TopNavActions')) {
    const importMatches = content.match(/^import .*$/gm);
    if (importMatches) {
      const lastImport = importMatches[importMatches.length - 1];
      content = content.replace(lastImport, `${lastImport}\nimport TopNavActions from '../components/TopNavActions'`);
      fs.writeFileSync(file, content);
      console.log(`Added import to ${f}`);
    }
  }
});

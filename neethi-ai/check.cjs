const fs = require('fs');

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
  const p = `src/pages/${f}`;
  if (fs.existsSync(p)) {
    console.log(`\n--- ${f} ---`);
    console.log(fs.readFileSync(p, 'utf8').split('\n').slice(0, 100).join('\n'));
  }
});

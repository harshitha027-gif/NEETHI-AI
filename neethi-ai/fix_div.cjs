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

  // We need to replace `        </div>\n      </header>` with `      </header>`
  // Or just replace `</div>\n      </header>`
  
  content = content.replace(/<\/div>\s*<\/header>/g, '</header>');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${fileName}`);
  }
});

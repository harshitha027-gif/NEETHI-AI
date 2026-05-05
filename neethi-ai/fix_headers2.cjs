const fs = require('fs');
const path = require('path');

const files = [
  { name: 'OfficerDashboard.tsx', active: 'Dashboard', hasPrintHidden: false },
  { name: 'AuditTrail.tsx', active: 'Audit Log', hasPrintHidden: false },
  { name: 'Analytics.tsx', active: 'Analytics', hasPrintHidden: false },
  { name: 'Settings.tsx', active: '', hasPrintHidden: false },
  { name: 'BidDetails.tsx', active: 'Tenders', hasPrintHidden: false },
  { name: 'KtppReport.tsx', active: '', hasPrintHidden: true }
];

files.forEach(f => {
  const file = path.join(__dirname, 'src', 'pages', f.name);
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Find the user block inside TopNavActions if it exists, otherwise empty
  let userBlock = '';
  if (content.includes('CURRENT_USER.name')) {
    userBlock = `
          <div className="text-right hidden sm:block mr-2">
            <p className="text-sm font-bold text-slate-900 leading-none">{CURRENT_USER.name}</p>
            <p className="text-[10px] uppercase text-slate-500 tracking-tight mt-0.5">
              {CURRENT_USER.department} · {CURRENT_USER.role}
            </p>
          </div>`;
  }

  const headerClass = f.hasPrintHidden 
    ? "print:hidden flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40"
    : "flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40";

  const newHeader = `      <header className="${headerClass}">
        <div className="text-xl font-black text-slate-900 flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Scale className="w-5 h-5 text-[#021934]" />
          NEETHI AI
        </div>

        <div className="flex items-center gap-6 h-full">
          <nav className="hidden md:flex gap-6 h-full items-center">
            {['Dashboard', 'Tenders', 'Analytics', 'Audit Log'].map((item, i) => (
              <a
                key={item}
                href="#"
                onClick={e => { e.preventDefault(); if (item === 'Dashboard') navigate('/dashboard'); else if (item === 'Tenders') navigate('/dashboard'); else if (item === 'Analytics') navigate('/analytics'); else if (item === 'Audit Log') navigate('/audit-log/search') }}
                className={\`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors \${
                  item === '${f.active}'
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-400 hover:text-slate-700'
                }\`}
              >
                {item}
              </a>
            ))}
          </nav>

          <TopNavActions>${userBlock}</TopNavActions>
        </div>
      </header>`;

  // Replace everything from <header to </header>
  // using a robust regex.
  const regex = /<header[^>]*>[\s\S]*?<\/header>/;
  content = content.replace(regex, newHeader.trim());

  fs.writeFileSync(file, content);
  console.log(`Restored header for ${f.name}`);
});

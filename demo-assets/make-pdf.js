const fs = require('fs');

const lines = [
  'TENDER BID DOCUMENT',
  '',
  'Company: Rajesh Infrastructure Pvt Ltd',
  'GSTIN: 29AACFR1234A1Z5',
  '',
  'Annual Turnover:',
  'FY2023: Rs.12.4 Crore',
  'FY2022: Rs.10.1 Crore',
  'FY2021: Rs.8.9 Crore',
  '',
  'ISO 9001:2015 Certificate: #IN-9001-2022-04471',
  'PWD Registration: KA-PWD-I-2019-0034',
  'Experience: 7 projects, avg 9.2 years',
  '',
  'Total Bid Amount: Rs.44.2 Crore',
  '',
  'Tender Reference: KTPP-2024-INF-001',
  'Tender Name: NH-75 Bypass Road Construction',
];

let stream = 'BT\n/F1 14 Tf\n';
let y = 720;
lines.forEach(line => {
  const safe = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  stream += '72 ' + y + ' Td (' + safe + ') Tj 0 0 Td\n';
  y -= 22;
});
stream += 'ET';

const len = Buffer.byteLength(stream, 'latin1');
const parts = [];

parts.push('%PDF-1.4\n');
const offsets = [];

offsets[1] = parts.join('').length;
parts.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

offsets[2] = parts.join('').length;
parts.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

offsets[3] = parts.join('').length;
parts.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n');

offsets[4] = parts.join('').length;
parts.push('4 0 obj\n<< /Length ' + len + ' >>\nstream\n' + stream + '\nendstream\nendobj\n');

offsets[5] = parts.join('').length;
parts.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

const body = parts.join('');
const xrefOffset = body.length;

let xref = 'xref\n0 6\n0000000000 65535 f \n';
for (let i = 1; i <= 5; i++) {
  xref += offsets[i].toString().padStart(10, '0') + ' 00000 n \n';
}
xref += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF';

const out = 'C:/Users/Harshitha/Desktop/NEETHI AI/demo-assets/bid-document.pdf';
fs.writeFileSync(out, body + xref, 'binary');
console.log('Done:', out);

const fs = require('fs');
const parser = require('@babel/parser');
const s = fs.readFileSync('src/App.jsx','utf8');
const regex = /\{activeMenu\s*===\s*"([^"]+)"\s*&&\s*\(/g;
let match;
const blocks = [];
while ((match = regex.exec(s)) !== null) {
  const startIndex = match.index;
  const after = s.indexOf('(', regex.lastIndex - 1);
  if (after < 0) continue;
  let depth = 0;
  let i = after;
  for (; i < s.length; i++) {
    const ch = s[i];
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) break;
    } else if (ch === '"' || ch === "'") {
      const q = ch; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i += 2; else i++; }
    } else if (ch === '`') { i++; while (i < s.length && s[i] !== '`') { if (s[i] === '\\') i += 2; else i++; } }
  }
  const endIndex = i + 1;
  blocks.push({ name: match[1], start: startIndex, end: endIndex, startLine: s.slice(0, startIndex).split(/\r?\n/).length, endLine: s.slice(0, endIndex).split(/\r?\n/).length });
}

console.log('Found sections:');
blocks.forEach((b, idx) => console.log(idx + 1 + ')', b.name, 'lines', b.startLine + '-' + b.endLine));

let found = false;
for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  const t = s.slice(0, b.start) + '{}' + s.slice(b.end);
  try {
    parser.parse(t, { sourceType: 'module', plugins: ['jsx', 'classProperties'] });
    console.log('Parse OK when removing section:', b.name, 'lines', b.startLine + '-' + b.endLine);
    found = true;
  } catch (e) {
    console.log('Still fails when removing section:', b.name);
  }
}

if (!found) console.log('No single-section removal made parse succeed; consider testing combinations.');
else console.log('One or more sections removal allowed parse to succeed — inspect those sections.');

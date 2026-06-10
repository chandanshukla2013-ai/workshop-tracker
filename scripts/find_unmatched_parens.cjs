const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'App.jsx');
const source = fs.readFileSync(file, 'utf8');
const stack = [];
const lineCol = (pos) => {
  const lines = source.slice(0, pos).split(/\r?\n/);
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
};
let i = 0;
let state = 'normal';
let quote = null;
while (i < source.length) {
  const ch = source[i];
  if (state === 'normal') {
    if (ch === '"' || ch === "'" ) { state = 'string'; quote = ch; i++; continue; }
    if (ch === '`') { state = 'template'; i++; continue; }
    if (ch === '/' && source[i+1] === '/') { state = 'linecomment'; i += 2; continue; }
    if (ch === '/' && source[i+1] === '*') { state = 'blockcomment'; i += 2; continue; }
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push({ ch, pos: i, loc: lineCol(i) });
    } else if (ch === ')' || ch === '}' || ch === ']') {
      const top = stack[stack.length - 1];
      const match = top && ((top.ch === '(' && ch === ')') || (top.ch === '{' && ch === '}') || (top.ch === '[' && ch === ']'));
      if (match) stack.pop();
      else stack.push({ ch, pos: i, loc: lineCol(i), unexpected: true });
    }
  } else if (state === 'string') {
    if (ch === '\\') { i += 2; continue; }
    if (ch === quote) { state = 'normal'; quote = null; }
  } else if (state === 'template') {
    if (ch === '\\') { i += 2; continue; }
    if (ch === '`') { state = 'normal'; }
    if (ch === '$' && source[i+1] === '{') {
      stack.push({ ch: '{', pos: i+1, loc: lineCol(i+1), templateExpr: true });
      i += 2;
      continue;
    }
  } else if (state === 'linecomment') {
    if (ch === '\n') state = 'normal';
  } else if (state === 'blockcomment') {
    if (ch === '*' && source[i+1] === '/') { state = 'normal'; i += 2; continue; }
  }
  i++;
}
console.log('stack length', stack.length);
stack.slice(-20).forEach((item) => {
  console.log(item);
});

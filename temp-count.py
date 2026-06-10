from pathlib import Path
import re
src = Path('src/App.jsx').read_text(encoding='utf8')
lines = src.splitlines()
paren = curly = square = 0
in_single = in_double = in_back = in_line = in_block = False
for i, line in enumerate(lines, start=1):
    j=0
    while j < len(line):
        ch = line[j]
        nxt = line[j+1] if j+1 < len(line) else ''
        if in_line:
            pass
        elif in_block:
            if ch=='*' and nxt=='/':
                in_block = False
                j += 1
        elif in_single:
            if ch == "'" and line[j-1] != '\\':
                in_single = False
        elif in_double:
            if ch == '"' and line[j-1] != '\\':
                in_double = False
        elif in_back:
            if ch == '`' and line[j-1] != '\\':
                in_back = False
        else:
            if ch == '/' and nxt == '/':
                in_line = True
                j += 1
            elif ch == '/' and nxt == '*':
                in_block = True
                j += 1
            elif ch == "'":
                in_single = True
            elif ch == '"':
                in_double = True
            elif ch == '`':
                in_back = True
            elif ch == '(':
                paren += 1
            elif ch == ')':
                paren -= 1
            elif ch == '[':
                square += 1
            elif ch == ']':
                square -= 1
            elif ch == '{':
                curly += 1
            elif ch == '}':
                curly -= 1
        j += 1
    in_line = False
    if i in {1,50,100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,2600,2700,2800,2900,3000,3100,3200,3300,3400,3450,3480,3490,3500,3510,3518,len(lines)}:
        print(i, paren, curly, square, line.strip())
print('final', paren, curly, square)

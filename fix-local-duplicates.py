#!/usr/bin/env python3
"""Remove adjacent duplicate const/return lines from app.ts that break Vite.

Run this in your Codespace terminal:
    python3 fix-local-duplicates.py
"""
import re
from pathlib import Path

FILE = Path('frontend/src/app.ts')

with FILE.open('r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

original_count = len(lines)
fixes = []

# Pattern 1: adjacent duplicate `const categoryText = ...`
i = 0
while i < len(lines) - 1:
    if 'const categoryText' in lines[i] and lines[i].strip() == lines[i+1].strip():
        fixes.append((i+2, lines[i].rstrip()))
        del lines[i+1]
        continue
    i += 1

# Pattern 2: adjacent duplicate `return ['<option value="">–...`
i = 0
while i < len(lines) - 1:
    if "return ['<option value=\"\">" in lines[i] and lines[i].strip() == lines[i+1].strip():
        fixes.append((i+2, lines[i].rstrip()))
        del lines[i+1]
        continue
    i += 1

if fixes:
    with FILE.open('w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f'\u2705 Fixed {len(fixes)} duplicate(s):')
    for line_no, content in fixes:
        print(f'   L{line_no}: removed duplicate of: {content[:90]!r}')
    print(f'\nFile: {len(lines)} lines (was {original_count})')
    print('\nNow run: git diff frontend/src/app.ts   to review the change')
    print('Then:    git add -A && git commit -m "fix: remove local duplicates"')
else:
    print('\u2705 No adjacent duplicates found. File is clean.')
    print('   (Maybe your error is from a different cause?)')

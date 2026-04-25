import fs from 'fs';
import path from 'path';
import isFullwidthCodePoint from 'is-fullwidth-code-point';
import emojiRegex from 'emoji-regex';

function generateWideRanges() {
  const ranges = [];
  let start = null;
  const er = emojiRegex();
  for (let i = 0; i <= 0x10ffff; i++) {
    let isWide = false;

    // Skip surrogate code points as String.fromCodePoint will throw a RangeError
    if (i >= 0xd800 && i <= 0xdfff) {
      isWide = false;
    } else {
      isWide = isFullwidthCodePoint(i);
      if (!isWide) {
        er.lastIndex = 0;
        isWide = er.test(String.fromCodePoint(i));
      }
    }

    if (isWide) {
      if (start === null) start = i;
    } else {
      if (start !== null) {
        ranges.push([start, i - 1]);
        start = null;
      }
    }
  }
  if (start !== null) ranges.push([start, 0x10ffff]);
  return ranges;
}

const ranges = generateWideRanges();
let rangesStr = '[\n';
for (const r of ranges) {
  rangesStr += `  [0x${r[0].toString(16)}, 0x${r[1].toString(16)}],\n`;
}
rangesStr += ']';

const unicodeFile = path.join(process.cwd(), 'lib/unicode.generated.js');
let content = fs.readFileSync(unicodeFile, 'utf8');

const wideRegex = /\/\/ --- BEGIN WIDE RANGES ---[\s\S]*?\/\/ --- END WIDE RANGES ---/;
const newWideCode = `// --- BEGIN WIDE RANGES ---\nexports.wideRanges = ${rangesStr};\n// --- END WIDE RANGES ---`;

if (wideRegex.test(content)) {
  content = content.replace(wideRegex, newWideCode);
  fs.writeFileSync(unicodeFile, content, 'utf8');
  console.log('Successfully updated unicode.generated.js with modern wide ranges.');
} else {
  console.error('Could not find wide ranges marker in unicode.generated.js');
  process.exit(1);
}
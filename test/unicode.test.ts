import { describe, it, expect } from 'vitest';
import isFullwidthCodePoint from 'is-fullwidth-code-point';
import emojiRegex from 'emoji-regex';
const unicode = require('../lib/unicode.js');

describe('Unicode Character Widths', () => {
  it('should correctly assign 1, 2 or 0 characters to modern unicode chars', () => {
    let failures = 0;
    const er = emojiRegex();

    for (let i = 0; i <= 0x10FFFF; i++) {
      // Skips 0-width (combining and invisible control characters)
      if (unicode.combining[i] || i < 32 || (i >= 0x7f && i < 0xa0)) {
        continue;
      }
      // Skip surrogates
      if (i >= 0xd800 && i <= 0xdfff) {
        continue;
      }

      let expectedWide = isFullwidthCodePoint(i);
      if (!expectedWide) {
        er.lastIndex = 0;
        expectedWide = er.test(String.fromCodePoint(i));
      }

      const actualWidth = unicode.charWidth(i);
      const isWide = actualWidth === 2;

      if (expectedWide !== isWide) {
        failures++;
      }
    }
    expect(failures).toBe(0);
  });
});
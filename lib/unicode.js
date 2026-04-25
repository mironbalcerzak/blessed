/** * unicode.js - east asian width and surrogate pairs
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 * Borrowed from vangie/east-asian-width, komagata/eastasianwidth,
 * and mathiasbynens/String.prototype.codePointAt. Licenses below.
 */

var stringFromCharCode = String.fromCharCode;
var floor = Math.floor;

/** * Wide, Surrogates, and Combining
 */

exports.wideRanges = require('./unicode.generated.js').wideRanges;

exports.charWidth = function(str, i) {
  var point = typeof str !== 'number'
      ? exports.codePointAt(str, i || 0)
      : str;

  if (point === 0) return 0;

  if (point === 0x09) {
    if (!exports.blessed) {
      exports.blessed = require('../');
    }
    return exports.blessed.screen.global
        ? exports.blessed.screen.global.tabc.length
        : 8;
  }

  if (point < 32 || (point >= 0x7f && point < 0xa0)) {
    return 0;
  }

  if (exports.combining[point]) {
    return 0;
  }

  var ranges = exports.wideRanges;
  if (ranges) {
    for (var j = 0; j < ranges.length; j++) {
      if (point >= ranges[j][0] && point <= ranges[j][1]) {
        return 2;
      }
    }
  }

  return 1;
};

exports.strWidth = function(str) {
  var width = 0;
  for (var i = 0; i < str.length; i++) {
    width += exports.charWidth(str, i);
    if (exports.isSurrogate(str, i)) i++;
  }
  return width;
};

exports.isSurrogate = function(str, i) {
  var point = typeof str !== 'number'
      ? exports.codePointAt(str, i || 0)
      : str;
  return point > 0x00ffff;
};

exports.combiningTable = [
  [0x0300, 0x036F],   [0x0483, 0x0486],   [0x0488, 0x0489],
  [0x0591, 0x05BD],   [0x05BF, 0x05BF],   [0x05C1, 0x05C2],
  [0x05C4, 0x05C5],   [0x05C7, 0x05C7],   [0x0600, 0x0603],
  [0x0610, 0x0615],   [0x064B, 0x065E],   [0x0670, 0x0670],
  [0x06D6, 0x06E4],   [0x06E7, 0x06E8],   [0x06EA, 0x06ED],
  [0x070F, 0x070F],   [0x0711, 0x0711],   [0x0730, 0x074A],
  [0x07A6, 0x07B0],   [0x07EB, 0x07F3],   [0x0901, 0x0902],
  [0x093C, 0x093C],   [0x0941, 0x0948],   [0x094D, 0x094D],
  [0x0951, 0x0954],   [0x0962, 0x0963],   [0x0981, 0x0981],
  [0x09BC, 0x09BC],   [0x09C1, 0x09C4],   [0x09CD, 0x09CD],
  [0x09E2, 0x09E3],   [0x0A01, 0x0A02],   [0x0A3C, 0x0A3C],
  [0x0A41, 0x0A42],   [0x0A47, 0x0A48],   [0x0A4B, 0x0A4D],
  [0x0A70, 0x0A71],   [0x0A81, 0x0A82],   [0x0ABC, 0x0ABC],
  [0x0AC1, 0x0AC5],   [0x0AC7, 0x0AC8],   [0x0ACD, 0x0ACD],
  [0x0AE2, 0x0AE3],   [0x0B01, 0x0B01],   [0x0B3C, 0x0B3C],
  [0x0B3F, 0x0B3F],   [0x0B41, 0x0B43],   [0x0B4D, 0x0B4D],
  [0x0B56, 0x0B56],   [0x0B82, 0x0B82],   [0x0BC0, 0x0BC0],
  [0x0BCD, 0x0BCD],   [0x0C3E, 0x0C40],   [0x0C46, 0x0C48],
  [0x0C4A, 0x0C4D],   [0x0C55, 0x0C56],   [0x0CBC, 0x0CBC],
  [0x0CBF, 0x0CBF],   [0x0CC6, 0x0CC6],   [0x0CCC, 0x0CCD],
  [0x0CE2, 0x0CE3],   [0x0D41, 0x0D43],   [0x0D4D, 0x0D4D],
  [0x0DCA, 0x0DCA],   [0x0DD2, 0x0DD4],   [0x0DD6, 0x0DD6],
  [0x0E31, 0x0E31],   [0x0E34, 0x0E3A],   [0x0E47, 0x0E4E],
  [0x0EB1, 0x0EB1],   [0x0EB4, 0x0EB9],   [0x0EBB, 0x0EBC],
  [0x0EC8, 0x0ECD],   [0x0F18, 0x0F19],   [0x0F35, 0x0F35],
  [0x0F37, 0x0F37],   [0x0F39, 0x0F39],   [0x0F71, 0x0F7E],
  [0x0F80, 0x0F84],   [0x0F86, 0x0F87],   [0x0F90, 0x0F97],
  [0x0F99, 0x0FBC],   [0x0FC6, 0x0FC6],   [0x102D, 0x1030],
  [0x1032, 0x1032],   [0x1036, 0x1037],   [0x1039, 0x1039],
  [0x1058, 0x1059],   [0x1160, 0x11FF],   [0x135F, 0x135F],
  [0x1712, 0x1714],   [0x1732, 0x1734],   [0x1752, 0x1753],
  [0x1772, 0x1773],   [0x17B4, 0x17B5],   [0x17B7, 0x17BD],
  [0x17C6, 0x17C6],   [0x17C9, 0x17D3],   [0x17DD, 0x17DD],
  [0x180B, 0x180D],   [0x18A9, 0x18A9],   [0x1920, 0x1922],
  [0x1927, 0x1928],   [0x1932, 0x1932],   [0x1939, 0x193B],
  [0x1A17, 0x1A18],   [0x1B00, 0x1B03],   [0x1B34, 0x1B34],
  [0x1B36, 0x1B3A],   [0x1B3C, 0x1B3C],   [0x1B42, 0x1B42],
  [0x1B6B, 0x1B73],   [0x1DC0, 0x1DCA],   [0x1DFE, 0x1DFF],
  [0x200B, 0x200F],   [0x202A, 0x202E],   [0x2060, 0x2063],
  [0x206A, 0x206F],   [0x20D0, 0x20EF],   [0x302A, 0x302F],
  [0x3099, 0x309A],   [0xA806, 0xA806],   [0xA80B, 0xA80B],
  [0xA825, 0xA826],   [0xFB1E, 0xFB1E],   [0xFE00, 0xFE0F],
  [0xFE20, 0xFE23],   [0xFEFF, 0xFEFF],   [0xFFF9, 0xFFFB],
  [0x10A01, 0x10A03], [0x10A05, 0x10A06], [0x10A0C, 0x10A0F],
  [0x10A38, 0x10A3A], [0x10A3F, 0x10A3F], [0x1D167, 0x1D169],
  [0x1D173, 0x1D182], [0x1D185, 0x1D18B], [0x1D1AA, 0x1D1AD],
  [0x1D242, 0x1D244], [0xE0001, 0xE0001], [0xE0020, 0xE007F],
  [0xE0100, 0xE01EF]
];

exports.combining = exports.combiningTable.reduce(function(out, row) {
  for (var i = row[0]; i <= row[1]; i++) {
    out[i] = true;
  }
  return out;
}, {});

exports.isCombining = function(str, i) {
  var point = typeof str !== 'number'
      ? exports.codePointAt(str, i || 0)
      : str;
  return exports.combining[point] === true;
};

/** * Code Point Helpers
 */

exports.codePointAt = function(str, position) {
  if (str == null) {
    throw TypeError();
  }
  var string = String(str);
  if (string.codePointAt) {
    return string.codePointAt(position);
  }
  var size = string.length;
  var index = position ? Number(position) : 0;
  if (index !== index) {
    index = 0;
  }
  if (index < 0 || index >= size) {
    return undefined;
  }
  var first = string.charCodeAt(index);
  var second;
  if (
      first >= 0xD800 && first <= 0xDBFF &&
      size > index + 1
  ) {
    second = string.charCodeAt(index + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
};

exports.fromCodePoint = function() {
  if (String.fromCodePoint) {
    return String.fromCodePoint.apply(String, arguments);
  }
  var MAX_SIZE = 0x4000;
  var codeUnits = [];
  var highSurrogate;
  var lowSurrogate;
  var index = -1;
  var length = arguments.length;
  if (!length) {
    return '';
  }
  var result = '';
  while (++index < length) {
    var codePoint = Number(arguments[index]);
    if (
        !isFinite(codePoint) ||
        codePoint < 0 ||
        codePoint > 0x10FFFF ||
        floor(codePoint) !== codePoint
    ) {
      throw RangeError('Invalid code point: ' + codePoint);
    }
    if (codePoint <= 0xFFFF) {
      codeUnits.push(codePoint);
    } else {
      codePoint -= 0x10000;
      highSurrogate = (codePoint >> 10) + 0xD800;
      lowSurrogate = (codePoint % 0x400) + 0xDC00;
      codeUnits.push(highSurrogate, lowSurrogate);
    }
    if (index + 1 === length || codeUnits.length > MAX_SIZE) {
      result += stringFromCharCode.apply(null, codeUnits);
      codeUnits.length = 0;
    }
  }
  return result;
};

/** * Regexes
 */

exports.chars = {};

function hexify(n) {
  n = n.toString(16);
  while (n.length < 4) n = '0' + n;
  return n;
}

var combiningStr = exports.combiningTable.reduce(function(out, row) {
  var low, high, range;
  if (row[0] > 0x00ffff) {
    low = exports.fromCodePoint(row[0]);
    low = [
      hexify(low.charCodeAt(0)),
      hexify(low.charCodeAt(1))
    ];
    high = exports.fromCodePoint(row[1]);
    high = [
      hexify(high.charCodeAt(0)),
      hexify(high.charCodeAt(1))
    ];
    range = '[\\u' + low[0] + '-' + '\\u' + high[0] + ']'
        + '[\\u' + low[1] + '-' + '\\u' + high[1] + ']';
    if (!~out.indexOf('|')) out += ']';
    out += '|(?:' + range + ')';
  } else {
    low = hexify(row[0]);
    high = hexify(row[1]);
    low = '\\u' + low;
    high = '\\u' + high;
    out += low + '-' + high;
  }
  return out;
}, '[');

if (!~combiningStr.indexOf('|')) combiningStr += ']';
combiningStr = '(?:' + combiningStr + ')';

function _buildRegexes() {
  var wideRegexStr = '[';
  var swideParts = [];
  var ranges = exports.wideRanges || [];

  function hex(n) {
    n = n.toString(16);
    while (n.length < 4) n = '0' + n;
    return n;
  }

  for (var i = 0; i < ranges.length; i++) {
    var start = ranges[i][0];
    var end = ranges[i][1];

    if (start <= 0xFFFF) {
      var bmpEnd = Math.min(end, 0xFFFF);
      if (start === bmpEnd) {
        wideRegexStr += '\\u' + hex(start);
      } else {
        wideRegexStr += '\\u' + hex(start) + '-\\u' + hex(bmpEnd);
      }
    }

    if (end > 0xFFFF) {
      var astralStart = Math.max(start, 0x10000);
      var hStart = Math.floor((astralStart - 0x10000) / 0x400) + 0xD800;
      var hEnd = Math.floor((end - 0x10000) / 0x400) + 0xD800;
      if (hStart === hEnd) {
        var lStart = ((astralStart - 0x10000) % 0x400) + 0xDC00;
        var lEnd = ((end - 0x10000) % 0x400) + 0xDC00;
        if (lStart === 0xDC00 && lEnd === 0xDFFF) {
          swideParts.push('[\\u' + hex(hStart) + '][\\uDC00-\\uDFFF]');
        } else {
          swideParts.push('[\\u' + hex(hStart) + '][\\u' + hex(lStart) + '-\\u' + hex(lEnd) + ']');
        }
      } else {
        var lStart = ((astralStart - 0x10000) % 0x400) + 0xDC00;
        var lEnd = ((end - 0x10000) % 0x400) + 0xDC00;

        if (lStart === 0xDC00 && lEnd === 0xDFFF) {
          swideParts.push('[\\u' + hex(hStart) + '-\\u' + hex(hEnd) + '][\\uDC00-\\uDFFF]');
        } else {
          if (lStart !== 0xDC00) {
            swideParts.push('[\\u' + hex(hStart) + '][\\u' + hex(lStart) + '-\\uDFFF]');
            hStart++;
          }
          if (lEnd !== 0xDFFF) {
            swideParts.push('[\\u' + hex(hEnd) + '][\\uDC00-\\u' + hex(lEnd) + ']');
            hEnd--;
          }
          if (hStart <= hEnd) {
            if (hStart === hEnd) {
              swideParts.push('[\\u' + hex(hStart) + '][\\uDC00-\\uDFFF]');
            } else {
              swideParts.push('[\\u' + hex(hStart) + '-\\u' + hex(hEnd) + '][\\uDC00-\\uDFFF]');
            }
          }
        }
      }
    }
  }
  wideRegexStr += ']';
  var swideRegexStr = '(' + (swideParts.length ? swideParts.join('|') : 'a^') + ')';

  exports.chars.wide = new RegExp('(' + wideRegexStr + combiningStr + '*)', 'g');
  exports.chars.swide = new RegExp('((?:' + swideRegexStr.slice(1, -1) + ')' + combiningStr + '*)', 'g');
  exports.chars.all = new RegExp('((?:' + swideRegexStr.slice(1, -1) + '|' + wideRegexStr + ')' + combiningStr + '*)', 'g');
}
_buildRegexes();

exports.chars.surrogate = /[\ud800-\udbff][\udc00-\udfff]/g;
exports.chars.combining = new RegExp(combiningStr, 'g');

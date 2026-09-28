import QRCode from 'qrcode';

/**
 * Generate QR code as PNG data URL or SVG string
 */
export async function generateQrCode(
  data: string,
  options: {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    darkColor?: string;
    lightColor?: string;
    format?: 'png' | 'svg';
  } = {}
): Promise<{ dataUrl: string; svgString?: string }> {
  const opts: QRCode.QRCodeToDataURLOptions = {
    width: options.width ?? 320,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    color: {
      dark: options.darkColor ?? '#000000',
      light: options.lightColor ?? '#FFFFFF',
    },
  };

  const dataUrl = await QRCode.toDataURL(data, opts);
  let svgString: string | undefined;

  try {
    svgString = await QRCode.toString(data, {
      type: 'svg',
      margin: options.margin ?? 2,
      errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
      color: {
        dark: options.darkColor ?? '#000000',
        light: options.lightColor ?? '#FFFFFF',
      },
    });
  } catch (e) {
    // fallback if svg fails
  }

  return { dataUrl, svgString };
}

/**
 * Password Generator with strength calculation
 */
export function generatePassword(options: {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous?: boolean;
}): { password: string; entropy: number; strength: 'weak' | 'medium' | 'strong' | 'very-strong' } {
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeAmbiguous) {
    upper = upper.replace(/[IO]/g, '');
    lower = lower.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
    symbols = symbols.replace(/[|;:,.]/g, '');
  }

  let charset = '';
  const requiredChars: string[] = [];

  if (options.includeUppercase) {
    charset += upper;
    requiredChars.push(upper[Math.floor(Math.random() * upper.length)]);
  }
  if (options.includeLowercase) {
    charset += lower;
    requiredChars.push(lower[Math.floor(Math.random() * lower.length)]);
  }
  if (options.includeNumbers) {
    charset += numbers;
    requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (options.includeSymbols) {
    charset += symbols;
    requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  if (!charset) {
    charset = lower + numbers;
  }

  const length = Math.max(requiredChars.length, options.length);
  const passwordChars = [...requiredChars];

  // Fill the remaining length with cryptographically random chars if available
  const randomBytes = new Uint32Array(length - requiredChars.length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomBytes);
    for (let i = 0; i < randomBytes.length; i++) {
      passwordChars.push(charset[randomBytes[i] % charset.length]);
    }
  } else {
    for (let i = 0; i < length - requiredChars.length; i++) {
      passwordChars.push(charset[Math.floor(Math.random() * charset.length)]);
    }
  }

  // Shuffle array
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  const password = passwordChars.join('');
  const entropy = Math.round(password.length * Math.log2(charset.length));

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  if (entropy >= 80) strength = 'very-strong';
  else if (entropy >= 60) strength = 'strong';
  else if (entropy >= 40) strength = 'medium';

  return { password, entropy, strength };
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateMultipleUUIDs(count: number, uppercase: boolean = false): string[] {
  const result: string[] = [];
  const qty = Math.min(100, Math.max(1, count));
  for (let i = 0; i < qty; i++) {
    const uuid = generateUUID();
    result.push(uppercase ? uuid.toUpperCase() : uuid.toLowerCase());
  }
  return result;
}

/**
 * Format and Validate JSON
 */
export function formatJson(
  input: string,
  indentation: number | 'tab' = 2
): { formatted?: string; error?: string; line?: number; column?: number } {
  try {
    const parsed = JSON.parse(input);
    const indent = indentation === 'tab' ? '\t' : indentation;
    const formatted = JSON.stringify(parsed, null, indent);
    return { formatted };
  } catch (err: any) {
    const msg = err.message || 'Invalid JSON syntax';
    // Match line/column if present (e.g. "at position 42" or "at line 3 column 5")
    const matchPos = msg.match(/position (\d+)/i);
    let line: number | undefined;
    let column: number | undefined;

    if (matchPos && matchPos[1]) {
      const pos = parseInt(matchPos[1], 10);
      const sub = input.substring(0, pos);
      const lines = sub.split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return { error: msg, line, column };
  }
}

/**
 * Minify JSON
 */
export function minifyJson(input: string): { minified?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { minified: JSON.stringify(parsed) };
  } catch (err: any) {
    return { error: err.message || 'Invalid JSON' };
  }
}

/**
 * Base64 Encoding & Decoding
 */
export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch (e: any) {
    throw new Error('Failed to encode Base64: ' + e.message);
  }
}

export function decodeBase64(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input.trim())));
  } catch (e: any) {
    throw new Error('Failed to decode Base64. Ensure the input is valid Base64 string.');
  }
}

/**
 * URL Encoding & Decoding
 */
export function encodeUrl(input: string, full: boolean = false): string {
  return full ? encodeURIComponent(input) : encodeURI(input);
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch (e: any) {
    return decodeURI(input);
  }
}

/**
 * Word, Character, and Reading Statistics
 */
export function calculateTextStats(text: string) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0) : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
  const readingTimeMinutes = Math.ceil(words / 200); // 200 wpm
  const speakingTimeMinutes = Math.ceil(words / 130); // 130 wpm

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes,
  };
}

/**
 * Case Converters
 */
export function convertCase(
  text: string,
  targetCase:
    | 'uppercase'
    | 'lowercase'
    | 'titlecase'
    | 'sentencecase'
    | 'camelcase'
    | 'snakecase'
    | 'kebabcase'
    | 'constantcase'
    | 'dotcase'
): string {
  if (!text) return '';

  switch (targetCase) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'titlecase':
      return text.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

    case 'sentencecase':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    case 'camelcase': {
      const words = text.replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/);
      if (words.length === 0) return '';
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()))
        .join('');
    }

    case 'snakecase':
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');

    case 'kebabcase':
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');

    case 'constantcase':
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_');

    case 'dotcase':
      return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '.');

    default:
      return text;
  }
}

/**
 * Lorem Ipsum Generator
 */
export function generateLoremIpsum(count: number = 3, type: 'paragraphs' | 'sentences' | 'words' = 'paragraphs'): string {
  const wordsList = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
    'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
    'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut',
    'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
    'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
    'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  function randomSentence(): string {
    const len = 8 + Math.floor(Math.random() * 8);
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
    }
    const sent = words.join(' ');
    return sent.charAt(0).toUpperCase() + sent.slice(1) + '.';
  }

  function randomParagraph(): string {
    const sentCount = 4 + Math.floor(Math.random() * 4);
    const sentences: string[] = [];
    for (let i = 0; i < sentCount; i++) {
      sentences.push(randomSentence());
    }
    return sentences.join(' ');
  }

  if (type === 'words') {
    const picked: string[] = [];
    for (let i = 0; i < count; i++) {
      picked.push(wordsList[i % wordsList.length]);
    }
    return picked.join(' ');
  }

  if (type === 'sentences') {
    const sents: string[] = [];
    for (let i = 0; i < count; i++) {
      sents.push(randomSentence());
    }
    return sents.join(' ');
  }

  // paragraphs
  const paras: string[] = [];
  for (let i = 0; i < count; i++) {
    paras.push(randomParagraph());
  }
  return paras.join('\n\n');
}

/**
 * Unix Timestamp Converter
 */
export function convertTimestamp(input: string | number): {
  unixSeconds: number;
  unixMilliseconds: number;
  utcDate: string;
  localDate: string;
  relative: string;
} {
  let ts = typeof input === 'string' ? parseInt(input.trim(), 10) : input;
  if (isNaN(ts)) {
    // try parsing date string
    ts = new Date(input).getTime();
  }

  // If 10 digits, convert to ms
  const isSeconds = ts < 10000000000;
  const ms = isSeconds ? ts * 1000 : ts;
  const sec = isSeconds ? ts : Math.floor(ts / 1000);

  const date = new Date(ms);
  const now = Date.now();
  const diffSec = Math.floor((now - ms) / 1000);

  let relative = '';
  if (Math.abs(diffSec) < 60) relative = 'Just now';
  else if (diffSec > 0) {
    if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)} minutes ago`;
    else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)} hours ago`;
    else relative = `${Math.floor(diffSec / 86400)} days ago`;
  } else {
    const fut = Math.abs(diffSec);
    if (fut < 3600) relative = `In ${Math.floor(fut / 60)} minutes`;
    else if (fut < 86400) relative = `In ${Math.floor(fut / 3600)} hours`;
    else relative = `In ${Math.floor(fut / 86400)} days`;
  }

  return {
    unixSeconds: sec,
    unixMilliseconds: ms,
    utcDate: date.toUTCString(),
    localDate: date.toLocaleString(),
    relative,
  };
}

/**
 * Comprehensive Color Converter: HEX <-> RGB <-> HSL <-> CMYK
 */
export function parseAnyColor(input: string): {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
} {
  let r = 229, g = 57, b = 53; // Default Tools Workshop red

  const clean = input.trim();
  if (clean.startsWith('#')) {
    const h = clean.replace('#', '');
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else if (h.length >= 6) {
      r = parseInt(h.substring(0, 2), 16);
      g = parseInt(h.substring(2, 4), 16);
      b = parseInt(h.substring(4, 6), 16);
    }
  } else if (clean.startsWith('rgb')) {
    const parts = clean.replace(/[^\d,]/g, '').split(',').map((p) => parseInt(p, 10));
    if (parts.length >= 3) {
      r = parts[0] || 0;
      g = parts[1] || 0;
      b = parts[2] || 0;
    }
  }

  r = Math.min(255, Math.max(0, isNaN(r) ? 0 : r));
  g = Math.min(255, Math.max(0, isNaN(g) ? 0 : g));
  b = Math.min(255, Math.max(0, isNaN(b) ? 0 : b));

  // To Hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  // To HSL
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h = Math.round(h * 60);
  }
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  // To CMYK
  let c = 0, m = 0, y = 0, k = 1 - max;
  if (k < 1) {
    c = Math.round(((1 - rn - k) / (1 - k)) * 100);
    m = Math.round(((1 - gn - k) / (1 - k)) * 100);
    y = Math.round(((1 - bn - k) / (1 - k)) * 100);
  }
  k = Math.round(k * 100);

  return {
    hex,
    rgb: { r, g, b },
    hsl: { h, s, l },
    cmyk: { c, m, y, k },
  };
}

/**
 * Format / Beautify Code & Markup
 */
export function formatCode(code: string, language: 'html' | 'css' | 'xml'): string {
  if (!code.trim()) return '';

  if (language === 'html' || language === 'xml') {
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    // basic XML/HTML token indentation
    const tokens = code.replace(/>\s*</g, '><').split(/(?<=<[^>]+>)/g);
    for (const token of tokens) {
      if (!token.trim()) continue;
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }
      formatted += tab.repeat(indent) + token.trim() + '\n';
      if (token.startsWith('<') && !token.startsWith('</') && !token.endsWith('/>') && !token.startsWith('<!')) {
        indent++;
      }
    }
    return formatted.trim();
  }

  if (language === 'css') {
    return code
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .trim();
  }

  return code;
}

import { ToolDefinition } from '../types/tools';

export interface ToolSeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  schema: Record<string, any>;
}

export const TOOLS_SEO_MAP: Record<string, { title: string; description: string; keywords?: string[] }> = {
  // --- PDF TOOLS ---
  'merge-pdf': {
    title: 'Merge PDF Online Free – Combine Multiple PDF Files | Tools Workshop',
    description: 'Combine multiple PDF documents into one organized file in seconds. Free, secure, client-side merging with page reordering and zero server uploads.',
    keywords: ['merge pdf online', 'combine pdf files', 'join pdf documents', 'pdf binder free', 'merge pdf without limit'],
  },
  'split-pdf': {
    title: 'Split PDF Online – Extract & Separate PDF Pages | Tools Workshop',
    description: 'Split PDF pages into standalone documents or extract specific page ranges quickly. Private browser processing with instant zip download.',
    keywords: ['split pdf online', 'extract pdf pages', 'separate pdf', 'pdf page extractor', 'split pdf free'],
  },
  'compress-pdf': {
    title: 'Compress PDF Online – Reduce PDF File Size in Browser | Tools Workshop',
    description: 'Reduce PDF file size quickly without losing formatting or readable clarity. 100% private, free browser optimization with instant size comparison.',
    keywords: ['compress pdf online', 'reduce pdf size', 'shrink pdf file', 'optimize pdf', 'free pdf compressor'],
  },
  'rotate-pdf': {
    title: 'Rotate PDF Online – Turn PDF Pages Permanently | Tools Workshop',
    description: 'Rotate PDF pages 90, 180, or 270 degrees clockwise. Fix landscape and portrait orientation securely in your browser without watermarks.',
    keywords: ['rotate pdf online', 'turn pdf pages', 'pdf orientation changer', 'rotate pdf 90 degrees', 'fix upside down pdf'],
  },
  'extract-pdf-pages': {
    title: 'Extract PDF Pages Online – Export Selected Pages | Tools Workshop',
    description: 'Select, isolate, and save specific pages from any PDF into a clean new document. Fast, safe, and entirely processed within your local browser.',
    keywords: ['extract pdf pages', 'save specific pdf pages', 'pdf page selector', 'cut pages from pdf', 'export pdf pages'],
  },
  'delete-pdf-pages': {
    title: 'Delete PDF Pages Online – Remove Unwanted Pages | Tools Workshop',
    description: 'Remove extra or unwanted pages from your PDF file effortlessly. Clean up confidential or blank sheets and download a refreshed PDF instantly.',
    keywords: ['delete pdf pages', 'remove pages from pdf', 'pdf page remover', 'delete blank pages pdf', 'clean up pdf'],
  },
  'rearrange-pdf-pages': {
    title: 'Rearrange PDF Pages Online – Reorder & Sort Pages | Tools Workshop',
    description: 'Change the sequence and order of pages in your PDF document. Simple custom ordering with zero quality degradation and complete privacy.',
    keywords: ['rearrange pdf pages', 'reorder pdf', 'sort pdf pages', 'organize pdf pages', 'change pdf page order'],
  },
  'pdf-to-word': {
    title: 'PDF to Word Converter – Convert PDF to Docx Online | Tools Workshop',
    description: 'Convert PDF content into editable Microsoft Word (.docx) documents. Preserve headings, paragraphs, and formatting with free local processing.',
    keywords: ['pdf to word converter', 'convert pdf to docx', 'editable pdf to word', 'free pdf to docx', 'turn pdf into word'],
  },
  'pdf-to-text': {
    title: 'PDF to Text Converter – Extract Text from PDF Online | Tools Workshop',
    description: 'Extract raw text, notes, and paragraphs from PDF files in one click. Clean, readable text output ready to copy, edit, or download as a .txt file.',
    keywords: ['pdf to text', 'extract text from pdf', 'pdf to txt online', 'copy text from pdf', 'raw text from pdf'],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter – Export PDF Pages to Images | Tools Workshop',
    description: 'Convert every page of your PDF into crisp, high-resolution JPG images. Download single page snapshots or all pages in a convenient ZIP file.',
    keywords: ['pdf to jpg converter', 'convert pdf to images', 'pdf to jpeg online', 'export pdf as pictures', 'high quality pdf to jpg'],
  },
  'pdf-to-png': {
    title: 'PDF to PNG Converter – Lossless PDF Image Export | Tools Workshop',
    description: 'Transform PDF pages into crystal-clear lossless PNG images. Ideal for presentations, infographics, and graphics with high-definition rendering.',
    keywords: ['pdf to png converter', 'convert pdf to png', 'high resolution pdf to png', 'pdf page to picture', 'lossless pdf to image'],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter – Convert JPG Images to PDF | Tools Workshop',
    description: 'Turn your JPG and JPEG photos into a standardized, printable PDF file. Reorder images, adjust margins, and download your consolidated PDF.',
    keywords: ['jpg to pdf converter', 'convert jpg to pdf', 'images to pdf online', 'combine jpg to pdf', 'photos into pdf'],
  },
  'png-to-pdf': {
    title: 'PNG to PDF Converter – Combine PNGs into One PDF | Tools Workshop',
    description: 'Convert PNG graphics, scans, and screenshots into a single multi-page PDF document. Fast, free client-side conversion without file uploads.',
    keywords: ['png to pdf converter', 'convert png to pdf', 'screenshots to pdf', 'combine png into pdf', 'png photos to pdf'],
  },
  'image-to-pdf': {
    title: 'Image to PDF Converter – Photos to PDF Document | Tools Workshop',
    description: 'Convert any mix of JPG, PNG, and WebP images into a single professional PDF. Customize page sizing and orientation with browser-side speed.',
    keywords: ['image to pdf converter', 'pictures to pdf', 'photos to pdf document', 'batch image to pdf', 'free photo to pdf'],
  },
  'watermark-pdf': {
    title: 'Add Watermark to PDF – Protect PDF with Custom Stamp | Tools Workshop',
    description: 'Stamp custom confidential or copyright text across your PDF pages. Customize text, opacity, and positioning securely in your browser.',
    keywords: ['watermark pdf online', 'add watermark to pdf', 'stamp confidential pdf', 'protect pdf with watermark', 'custom pdf watermark'],
  },
  'remove-pdf-metadata': {
    title: 'PDF Metadata Remover – Strip PDF EXIF & Privacy Info | Tools Workshop',
    description: 'Strip hidden author names, software tools, creation dates, and metadata from your PDF files before sharing. Maintain complete privacy.',
    keywords: ['pdf metadata remover', 'strip pdf metadata', 'clean pdf exif', 'sanitize pdf file', 'remove pdf author data'],
  },
  'protect-pdf': {
    title: 'Protect PDF Online – Set Password & Secure PDF File | Tools Workshop',
    description: 'Secure your sensitive PDF documents with robust encryption. Control reading permissions and protect confidential records right in your browser.',
    keywords: ['protect pdf online', 'password protect pdf', 'encrypt pdf file', 'secure pdf document', 'lock pdf with password'],
  },
  'unlock-pdf': {
    title: 'Unlock PDF Online – Remove Password Restrictions | Tools Workshop',
    description: 'Unlock authorized password-protected PDF files to remove printing and viewing restrictions. Fast, safe, and processed locally on your machine.',
    keywords: ['unlock pdf online', 'remove pdf password', 'decrypt pdf', 'pdf restrictions remover', 'authorized pdf unlock'],
  },
  'pdf-to-excel': {
    title: 'PDF to Excel Converter – Extract Tables to CSV/XLS | Tools Workshop',
    description: 'Extract tabular data, columns, and figures from PDF documents into structured CSV files compatible with Microsoft Excel and Google Sheets.',
    keywords: ['pdf to excel converter', 'extract table from pdf', 'pdf to csv online', 'convert pdf to spreadsheet', 'pdf to xls'],
  },

  // --- IMAGE TOOLS ---
  'jpg-to-png': {
    title: 'JPG to PNG Converter – Convert JPG to Transparent PNG | Tools Workshop',
    description: 'Convert JPG images into high-quality, lossless PNG files with support for transparency. Fast client-side image processing with instant download.',
    keywords: ['jpg to png converter', 'convert jpeg to png', 'jpg to transparent png', 'high quality jpg to png', 'free image converter'],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter – Convert PNG with Custom Background | Tools Workshop',
    description: 'Convert transparent PNG images to lightweight, universal JPG files. Choose custom background fill colors and adjust quality for ideal file size.',
    keywords: ['png to jpg converter', 'convert png to jpeg', 'transparent png to jpg', 'png to jpg with white background', 'image format converter'],
  },
  'jpg-to-webp': {
    title: 'JPG to WebP Converter – Next-Gen Image Optimization | Tools Workshop',
    description: 'Convert JPG photos to modern WebP format for smaller file sizes and faster web page load times. Free, lossy/lossless browser-based compression.',
    keywords: ['jpg to webp converter', 'convert jpg to webp', 'next gen image format', 'compress image to webp', 'web performance images'],
  },
  'webp-to-jpg': {
    title: 'WebP to JPG Converter – Universal Image Converter | Tools Workshop',
    description: 'Convert modern WebP images into universally compatible JPG files for easy editing and sharing. High-fidelity rendering with quality slider.',
    keywords: ['webp to jpg converter', 'convert webp to jpeg', 'save webp as jpg', 'webp image to jpg', 'free webp converter'],
  },
  'webp-to-png': {
    title: 'WebP to PNG Converter – Lossless WebP to PNG Online | Tools Workshop',
    description: 'Transform WebP pictures into lossless PNG images with full transparency preserved. No software installation or upload queues required.',
    keywords: ['webp to png converter', 'convert webp to png', 'webp transparent to png', 'lossless webp converter', 'download png from webp'],
  },
  'png-to-webp': {
    title: 'PNG to WebP Converter – Ultra Fast Web Images | Tools Workshop',
    description: 'Convert PNG graphics and illustrations to ultra-compact WebP images. Maintain alpha transparency while slashing file sizes by up to 80%.',
    keywords: ['png to webp converter', 'convert png to webp', 'transparent png to webp', 'shrink png with webp', 'optimize png for web'],
  },
  'image-compressor': {
    title: 'Image Compressor Online – Shrink Photos Without Quality Loss | Tools Workshop',
    description: 'Compress JPG, PNG, and WebP images quickly while maintaining crisp visual fidelity. Features real-time size reduction stats and custom quality sliders.',
    keywords: ['image compressor online', 'compress photos free', 'reduce image file size', 'shrink jpeg png', 'lossless image compressor'],
  },
  'resize-image': {
    title: 'Resize Image Online – Custom Dimensions & Social Presets | Tools Workshop',
    description: 'Resize image width and height with aspect ratio lock or use ready-made social presets for Instagram, YouTube, and Facebook. Fast and free.',
    keywords: ['resize image online', 'change image dimensions', 'photo resizer free', 'resize image for instagram', 'scale image pixels'],
  },
  'crop-image': {
    title: 'Crop Image Online – Aspect Ratio & Freeform Cropper | Tools Workshop',
    description: 'Crop images easily with interactive framing and standard aspect ratios (1:1, 16:9, 4:3, 9:16). Download your perfectly framed picture instantly.',
    keywords: ['crop image online', 'photo cropper free', 'crop image 16:9', 'square photo crop', 'cut image online'],
  },
  'rotate-image': {
    title: 'Rotate & Flip Image Online – Mirror & Orientation Tool | Tools Workshop',
    description: 'Rotate images by 90, 180, or 270 degrees, or flip horizontally and vertically to create mirror effects. Quick client-side transformation.',
    keywords: ['rotate image online', 'flip image horizontally', 'mirror photo online', 'turn picture 90 degrees', 'image orientation fix'],
  },
  'grayscale-image': {
    title: 'Grayscale Image Online – Convert Photos to Black & White | Tools Workshop',
    description: 'Transform color photos into classic black and white monochrome images. Fine-tune contrast and luminance with real-time browser preview.',
    keywords: ['grayscale image online', 'convert photo to black and white', 'monochrome picture converter', 'b&w photo filter', 'desaturate image'],
  },
  'image-watermark': {
    title: 'Add Watermark to Image – Copyright & Logo Stamp Tool | Tools Workshop',
    description: 'Protect your photographs by stamping custom copyright text or watermarks. Adjust font size, transparency, and positioning in real-time.',
    keywords: ['add watermark to image', 'watermark photo online', 'copyright stamp image', 'protect photos online', 'text on image watermark'],
  },
  'background-remover': {
    title: 'Image Background Remover – Cut Out Transparent PNGs | Tools Workshop',
    description: 'Erase solid backgrounds from product photos and graphics into transparent PNG cutouts. Features adjustable sensitivity and feathering.',
    keywords: ['image background remover', 'remove bg online', 'transparent background maker', 'cut out picture online', 'erase image background'],
  },
  'remove-image-metadata': {
    title: 'Image Metadata Remover – Strip EXIF & Camera GPS Data | Tools Workshop',
    description: 'Clean EXIF tags, GPS locations, camera models, and timestamps from photos before sharing online. Safeguard your personal privacy effortlessly.',
    keywords: ['image metadata remover', 'strip exif data', 'remove photo gps', 'clean image tags', 'privacy photo cleaner'],
  },
  'image-color-picker': {
    title: 'Image Color Picker & Palette Extractor – Hex, RGB, HSL | Tools Workshop',
    description: 'Inspect exact pixel color codes from any image and extract dominant color palettes in HEX, RGB, and HSL. Click anywhere to inspect.',
    keywords: ['image color picker', 'extract palette from image', 'eyedropper tool online', 'get hex code from photo', 'dominant colors image'],
  },

  // --- DOCUMENT TOOLS ---
  'word-to-pdf': {
    title: 'Word to PDF Converter – Convert DOCX to PDF Online | Tools Workshop',
    description: 'Convert Microsoft Word (.docx) files into clean, standardized PDF documents. Accurate typography rendering right inside your web browser.',
    keywords: ['word to pdf converter', 'convert docx to pdf', 'free word to pdf', 'turn docx into pdf', 'ms word to pdf online'],
  },
  'text-to-pdf': {
    title: 'Text to PDF Converter – Generate Formatted PDF Documents | Tools Workshop',
    description: 'Turn typed text, memos, and plain notes into a cleanly formatted, printable PDF document. Set custom titles and line spacing in seconds.',
    keywords: ['text to pdf converter', 'notes to pdf', 'type to pdf online', 'convert plain text to pdf', 'create pdf from text'],
  },
  'txt-to-pdf': {
    title: 'TXT to PDF Converter – Convert Text Files to Clean PDF | Tools Workshop',
    description: 'Upload a plain .txt file and transform it into a formatted multi-page PDF document. Safe, fast, and processed entirely on your machine.',
    keywords: ['txt to pdf converter', 'convert txt to pdf', 'text file to pdf', 'plain text into pdf', 'batch txt to pdf'],
  },
  'markdown-to-pdf': {
    title: 'Markdown to PDF Converter – Render MD to Styled PDF | Tools Workshop',
    description: 'Transform Markdown (.md) documents with headings, bullet lists, and code blocks into polished, printable PDF files with clean typography.',
    keywords: ['markdown to pdf converter', 'convert md to pdf', 'render markdown to pdf', 'readme to pdf', 'developer markdown to pdf'],
  },
  'html-to-pdf': {
    title: 'HTML to PDF Converter – Convert Web Code to PDF Document | Tools Workshop',
    description: 'Convert raw HTML code snippets into a formatted PDF document. Fast browser-native parsing and instant PDF generation with zero server dependencies.',
    keywords: ['html to pdf converter', 'convert html to pdf', 'webpage code to pdf', 'html snippet to pdf', 'free html to pdf'],
  },

  // --- UTILITY TOOLS ---
  'qr-code-generator': {
    title: 'QR Code Generator – Free Custom QR Codes with Colors | Tools Workshop',
    description: 'Generate high-resolution QR codes for URLs, Wi-Fi networks, text, emails, and phone numbers. Customize foreground and background colors freely.',
    keywords: ['qr code generator', 'free qr code maker', 'custom qr code with colors', 'wifi qr code generator', 'download qr code png svg'],
  },
  'password-generator': {
    title: 'Password Generator – Strong & Secure Random Passwords | Tools Workshop',
    description: 'Create cryptographically strong, uncrackable random passwords with custom lengths and symbol rules. Calculates password entropy and strength.',
    keywords: ['password generator', 'strong password maker', 'secure random password', 'password strength checker', 'credentials generator'],
  },
  'uuid-generator': {
    title: 'UUID Generator – Generate Random UUID v4 Tokens Online | Tools Workshop',
    description: 'Generate standard RFC 4122 Version-4 UUIDs individually or in bulk. Fast, cryptographically secure identifier generation with one-click copy.',
    keywords: ['uuid generator', 'guid generator online', 'uuid v4 generator', 'bulk uuid generator', 'unique identifier maker'],
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator – Beautify & Minify JSON | Tools Workshop',
    description: 'Beautify, inspect, validate, and minify JSON with real-time line-and-column syntax error highlighting. Clean formatted output ready to copy.',
    keywords: ['json formatter', 'pretty print json', 'json validator online', 'minify json', 'json beautifier tool'],
  },
  'base64-encoder': {
    title: 'Base64 Encoder & Decoder – Convert Text & Data Online | Tools Workshop',
    description: 'Encode plain text into standard Base64 format or decode Base64 strings back to readable UTF-8 text. Instant client-side encoding utility.',
    keywords: ['base64 encoder', 'base64 decoder', 'btoa atob online', 'base64 converter', 'encode string to base64'],
  },
  'url-encoder': {
    title: 'URL Encoder & Decoder – Percent-Encoding Online Tool | Tools Workshop',
    description: 'Encode special characters and query strings for web safety or decode percent-encoded URLs back to plain text. Instant browser utility.',
    keywords: ['url encoder', 'url decoder', 'percent encoding tool', 'encodeURIComponent online', 'clean url parameter tool'],
  },
  'code-formatter': {
    title: 'Code & Markup Formatter – Beautify HTML, CSS & XML | Tools Workshop',
    description: 'Beautify and format messy HTML, CSS, and XML code with standardized indentations. Clean up code snippets directly in your browser.',
    keywords: ['code formatter online', 'html beautifier', 'css formatter', 'xml formatter', 'clean code formatter'],
  },
  'word-counter': {
    title: 'Word & Character Counter – Text Stats & Reading Time | Tools Workshop',
    description: 'Analyze text statistics in real-time: count words, characters, sentences, paragraphs, and calculate estimated reading and speaking times.',
    keywords: ['word counter', 'character count tool', 'reading time calculator', 'text statistics analyzer', 'word counter online'],
  },
  'case-converter': {
    title: 'Case Converter – UPPERCASE, lowercase, camelCase & snake_case | Tools Workshop',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case with one click.',
    keywords: ['case converter', 'convert text to uppercase', 'title case converter', 'camelCase converter', 'snake_case converter'],
  },
  'lorem-ipsum-generator': {
    title: 'Lorem Ipsum Generator – Placeholder Dummy Text Creator | Tools Workshop',
    description: 'Generate placeholder dummy text by paragraphs, sentences, or word counts for web design and mockups. Copy clean Latin copy instantly.',
    keywords: ['lorem ipsum generator', 'dummy text generator', 'placeholder text creator', 'mock copy generator', 'latin text generator'],
  },
  'timestamp-converter': {
    title: 'Timestamp Converter – Unix Epoch to Human Date Time | Tools Workshop',
    description: 'Convert Unix epoch timestamps in seconds or milliseconds into UTC and local date formats, or convert dates to timestamps with relative time.',
    keywords: ['timestamp converter', 'unix epoch to date', 'epoch time converter', 'current unix timestamp', 'utc timestamp converter'],
  },
  'color-converter': {
    title: 'Color Converter & Harmony – HEX, RGB, HSL & CMYK Tool | Tools Workshop',
    description: 'Convert color codes between HEX, RGB, HSL, and CMYK with a live color picker and harmonious palette generator. Fast and accurate.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex converter', 'hsl to cmyk', 'color harmony generator'],
  },
};

/**
 * Get complete SEO metadata for a tool, with intelligent fallback
 */
export function getToolSeoMetadata(tool: ToolDefinition): ToolSeoMetadata {
  const custom = TOOLS_SEO_MAP[tool.slug] || TOOLS_SEO_MAP[tool.id];

  const title =
    tool.seoTitle ||
    custom?.title ||
    `${tool.name} Online – Free Browser Tool | Tools Workshop`;

  const description =
    tool.seoDescription ||
    custom?.description ||
    `${tool.shortDescription} Fast, free, and secure client-side processing with Tools Workshop.`;

  const keywords = custom?.keywords || tool.keywords;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tools-workshop.com';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalUrl = `${origin}${pathname}#tool/${tool.slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.name} – Tools Workshop`,
    url: canonicalUrl,
    description,
    applicationCategory: tool.categoryLabel || 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    schema,
  };
}

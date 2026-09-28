import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import mammoth from 'mammoth';
import { readFileAsArrayBuffer, getFileBaseName } from './fileHelpers';

// Configure pdfjs worker safely
try {
  if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
    const version = (pdfjsLib as any).version || '4.10.38';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker setup note:', e);
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedDoc = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedDoc.addPage(page));

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 90));
    }
  }

  const pdfBytes = await mergedDoc.save();
  if (onProgress) onProgress(100);

  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Get page count and basic details of a PDF file
 */
export async function getPdfDetails(file: File): Promise<{ pageCount: number; title?: string; author?: string }> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
  };
}

/**
 * Split PDF: either by page range (e.g. "1-3, 5") or all pages into a ZIP
 */
export async function splitPdf(
  file: File,
  mode: 'range' | 'all',
  pageRangeStr?: string,
  onProgress?: (percent: number) => void
): Promise<{ blob: Blob; filename: string; count: number }> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const baseName = getFileBaseName(file.name);

  if (mode === 'all') {
    const zip = new JSZip();
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);
      const pdfBytes = await newDoc.save();
      zip.file(`${baseName}_page_${i + 1}.pdf`, pdfBytes);

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalPages) * 85));
      }
    }

    if (onProgress) onProgress(90);
    const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      if (onProgress) onProgress(90 + Math.round(metadata.percent * 0.1));
    });

    return {
      blob: zipBlob,
      filename: `${baseName}_split_pages.zip`,
      count: totalPages,
    };
  } else {
    // Range mode
    if (!pageRangeStr || !pageRangeStr.trim()) {
      throw new Error('Please specify valid page ranges (e.g. 1-3, 5).');
    }

    const indicesToExtract = parsePageRange(pageRangeStr, totalPages);
    if (indicesToExtract.length === 0) {
      throw new Error(`No valid pages found in range "${pageRangeStr}". Total pages: ${totalPages}`);
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, indicesToExtract);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const pdfBytes = await newDoc.save();
    return {
      blob: new Blob([pdfBytes as any], { type: 'application/pdf' }),
      filename: `${baseName}_extracted.pdf`,
      count: indicesToExtract.length,
    };
  }
}

/**
 * Delete selected pages from PDF
 */
export async function deletePdfPages(
  file: File,
  pagesToDelete1Based: number[]
): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const toDeleteSet = new Set(pagesToDelete1Based.map((p) => p - 1));
  const keepIndices: number[] = [];

  for (let i = 0; i < totalPages; i++) {
    if (!toDeleteSet.has(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('Cannot delete all pages. The resulting document must have at least one page.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
  copiedPages.forEach((p) => newDoc.addPage(p));

  const pdfBytes = await newDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Rearrange pages in PDF
 */
export async function rearrangePdfPages(
  file: File,
  newOrder1Based: number[]
): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const indices = newOrder1Based.map((p) => p - 1).filter((idx) => idx >= 0 && idx < totalPages);
  if (indices.length === 0) {
    throw new Error('Invalid page order provided.');
  }

  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, indices);
  copiedPages.forEach((p) => newDoc.addPage(p));

  const pdfBytes = await newDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Rotate PDF pages by 90, 180, or 270 degrees
 */
export async function rotatePdf(
  file: File,
  angle: number,
  pagesToRotate: 'all' | number[]
): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = doc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const pageNum = i + 1;
    if (pagesToRotate === 'all' || pagesToRotate.includes(pageNum)) {
      const page = doc.getPage(i);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }
  }

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Add a custom text watermark across all pages of a PDF
 */
export async function watermarkPdf(
  file: File,
  watermarkText: string,
  options: {
    opacity?: number;
    fontSize?: number;
    colorHex?: string;
  } = {}
): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();

  const opacity = options.opacity ?? 0.35;
  const fontSize = options.fontSize ?? 42;
  const text = watermarkText.trim() || 'CONFIDENTIAL';

  // parse color
  let r = 0.8, g = 0.2, b = 0.2; // default red accent
  if (options.colorHex && options.colorHex.startsWith('#')) {
    const hex = options.colorHex.replace('#', '');
    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    }
  }

  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(45),
    });
  }

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Remove all metadata from a PDF
 */
export async function removePdfMetadata(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setProducer('Tools Workshop (Private Browser Processing)');
  doc.setCreator('Tools Workshop');

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Compress PDF: optimize internal objects, streams, and compress
 */
export async function compressPdf(
  file: File,
  _level: 'low' | 'medium' | 'high' = 'medium'
): Promise<{ blob: Blob; originalSize: number; newSize: number; reductionPercent: number }> {
  const originalSize = file.size;
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // PDF-lib's useObjectStreams dramatically streamlines and compresses PDF cross-references and object definitions
  const pdfBytes = await doc.save({
    useObjectStreams: true,
  });

  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const newSize = blob.size;
  const reductionPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    blob,
    originalSize,
    newSize,
    reductionPercent,
  };
}

/**
 * Convert images (JPG, PNG, WebP) to a single PDF
 */
export async function imagesToPdf(
  files: File[],
  options: {
    pageSize?: 'a4' | 'fit' | 'letter';
    orientation?: 'portrait' | 'landscape';
    margin?: number;
  } = {}
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('Please select at least one image.');
  }

  const doc = await PDFDocument.create();
  const margin = options.margin ?? 20;

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    let embeddedImage;

    const lowerName = file.name.toLowerCase();
    const isPng = lowerName.endsWith('.png') || file.type === 'image/png';
    const isJpg = lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || file.type === 'image/jpeg';

    if (isPng) {
      embeddedImage = await doc.embedPng(arrayBuffer);
    } else if (isJpg) {
      embeddedImage = await doc.embedJpg(arrayBuffer);
    } else {
      // For WebP or other formats, convert to PNG via canvas first
      const pngBlob = await convertImageViaCanvas(file, 'image/png');
      const pngBuffer = await readFileAsArrayBuffer(pngBlob as any);
      embeddedImage = await doc.embedPng(pngBuffer);
    }

    const imgDims = embeddedImage.scale(1);

    if (options.pageSize === 'fit') {
      const page = doc.addPage([imgDims.width + margin * 2, imgDims.height + margin * 2]);
      page.drawImage(embeddedImage, {
        x: margin,
        y: margin,
        width: imgDims.width,
        height: imgDims.height,
      });
    } else {
      // Standard A4: 595.28 x 841.89 pt
      let pageWidth = 595.28;
      let pageHeight = 841.89;
      if (options.pageSize === 'letter') {
        pageWidth = 612;
        pageHeight = 792;
      }
      if (options.orientation === 'landscape') {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }

      const page = doc.addPage([pageWidth, pageHeight]);
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;

      // Scale proportionally to fit inside margin
      const scale = Math.min(availWidth / imgDims.width, availHeight / imgDims.height);
      const drawWidth = imgDims.width * scale;
      const drawHeight = imgDims.height * scale;
      const x = (pageWidth - drawWidth) / 2;
      const y = (pageHeight - drawHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Helper to convert an image file via Canvas
 */
async function convertImageViaCanvas(file: File, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Canvas context not available'));
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to convert image'));
      }, mimeType);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };
    img.src = url;
  });
}

/**
 * Extract full text from a PDF file using PDF.js
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item: any) => item.str ?? '');
    fullText += `--- Page ${i} ---\n` + pageStrings.join(' ') + '\n\n';

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 100));
    }
  }

  return fullText.trim();
}

/**
 * Convert PDF pages to JPG or PNG images
 */
export async function pdfToImages(
  file: File,
  format: 'image/jpeg' | 'image/png',
  quality: number = 0.92,
  onProgress?: (percent: number) => void
): Promise<{ images: { blob: Blob; url: string; page: number }[]; zipBlob?: Blob }> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const results: { blob: Blob; url: string; page: number }[] = [];
  const ext = format === 'image/jpeg' ? 'jpg' : 'png';
  const baseName = getFileBaseName(file.name);
  const zip = new JSZip();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x high-res rendering

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    // Fill white background for JPG
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await page.render(renderContext as any).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), format, quality);
    });

    const url = URL.createObjectURL(blob);
    results.push({ blob, url, page: i });
    zip.file(`${baseName}_page_${i}.${ext}`, blob);

    if (onProgress) {
      onProgress(Math.round((i / numPages) * 90));
    }
  }

  let zipBlob: Blob | undefined;
  if (numPages > 1) {
    zipBlob = await zip.generateAsync({ type: 'blob' });
  }

  if (onProgress) onProgress(100);
  return { images: results, zipBlob };
}

/**
 * Convert PDF to formatted Microsoft Word (.docx) document
 */
export async function pdfToWordDocx(file: File, onProgress?: (percent: number) => void): Promise<Blob> {
  const text = await extractTextFromPdf(file, onProgress);
  const baseName = getFileBaseName(file.name);

  // Parse lines into paragraphs
  const lines = text.split('\n');
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: baseName,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 300 },
    }),
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('--- Page')) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, color: '666666' })],
          spacing: { before: 200, after: 100 },
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22 })], // 11pt
          spacing: { after: 120 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  return docxBlob;
}

/**
 * Convert Microsoft Word (.docx) to PDF
 */
export async function wordDocxToPdf(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value || 'Empty document';

  return textToPdf(rawText, {
    title: getFileBaseName(file.name),
    fontSize: 11,
    lineSpacing: 16,
  });
}

/**
 * Convert Markdown text to PDF
 */
export async function markdownToPdf(markdownText: string, title?: string): Promise<Blob> {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  function checkPageBreak(neededHeight: number) {
    if (y - neededHeight < margin) {
      currentPage = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  }

  // Draw title if present
  if (title) {
    currentPage.drawText(title, {
      x: margin,
      y,
      size: 20,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 35;
  }

  const lines = markdownText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      y -= 12;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      checkPageBreak(36);
      currentPage.drawText(trimmed.replace('# ', ''), {
        x: margin,
        y,
        size: 18,
        font: fontBold,
        color: rgb(0.12, 0.12, 0.12),
      });
      y -= 28;
    } else if (trimmed.startsWith('## ')) {
      checkPageBreak(30);
      currentPage.drawText(trimmed.replace('## ', ''), {
        x: margin,
        y,
        size: 15,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= 24;
    } else if (trimmed.startsWith('### ')) {
      checkPageBreak(26);
      currentPage.drawText(trimmed.replace('### ', ''), {
        x: margin,
        y,
        size: 13,
        font: fontBold,
        color: rgb(0.25, 0.25, 0.25),
      });
      y -= 20;
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const bulletText = trimmed.substring(2);
      const wrapped = wrapText(bulletText, contentWidth - 20, fontRegular, 11);
      for (let idx = 0; idx < wrapped.length; idx++) {
        checkPageBreak(16);
        if (idx === 0) {
          currentPage.drawText('•', { x: margin + 4, y, size: 12, font: fontBold, color: rgb(0.89, 0.22, 0.21) });
        }
        currentPage.drawText(wrapped[idx], {
          x: margin + 20,
          y,
          size: 11,
          font: fontRegular,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= 16;
      }
    } else {
      // standard paragraph
      const wrapped = wrapText(trimmed, contentWidth, fontRegular, 11);
      for (const wLine of wrapped) {
        checkPageBreak(16);
        currentPage.drawText(wLine, {
          x: margin,
          y,
          size: 11,
          font: fontRegular,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= 16;
      }
      y -= 6;
    }
  }

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Convert plain text or TXT file to PDF
 */
export async function textToPdf(
  text: string,
  options: {
    title?: string;
    fontSize?: number;
    lineSpacing?: number;
  } = {}
): Promise<Blob> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = options.fontSize ?? 11;
  const lineSpacing = options.lineSpacing ?? 16;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  if (options.title) {
    currentPage.drawText(options.title, {
      x: margin,
      y,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 30;
  }

  const lines = text.split('\n');
  for (const rawLine of lines) {
    if (!rawLine.trim()) {
      y -= lineSpacing;
      if (y < margin) {
        currentPage = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      continue;
    }

    const wrapped = wrapText(rawLine, contentWidth, font, fontSize);
    for (const wLine of wrapped) {
      if (y - lineSpacing < margin) {
        currentPage = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      currentPage.drawText(wLine, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= lineSpacing;
    }
  }

  const pdfBytes = await doc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

/**
 * Helper to wrap text according to maximum width
 */
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : [''];
}

/**
 * Helper to parse page range strings such as "1-3, 5, 8-10" into 0-based indices
 */
function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let p = min; p <= max; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

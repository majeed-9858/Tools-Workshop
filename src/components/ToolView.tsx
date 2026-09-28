import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Sliders,
  Maximize2,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Eye,
  FileCheck,
  Globe,
  ExternalLink,
  Share2,
  Link2,
} from 'lucide-react';
import { ToolDefinition, UploadedFileItem, ProcessingState } from '../types/tools';
import { DynamicIcon } from './DynamicIcon';
import { FileUploader } from './FileUploader';
import { formatBytes, downloadBlob, getFileBaseName } from '../utils/fileHelpers';
import { getToolSeoMetadata } from '../data/toolsSeo';
import * as pdfUtils from '../utils/pdfUtils';
import * as imageUtils from '../utils/imageUtils';
import * as utilityUtils from '../utils/utilityUtils';

interface ToolViewProps {
  tool: ToolDefinition;
  onBack: () => void;
  onSelectCategory: (category: any) => void;
}

export const ToolView: React.FC<ToolViewProps> = ({ tool, onBack, onSelectCategory }) => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
  });

  // Common tool options state
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [pageRangeStr, setPageRangeStr] = useState('1-3');
  const [deletePagesStr, setDeletePagesStr] = useState('2');
  const [rearrangeOrderStr, setRearrangeOrderStr] = useState('');
  const [rotationAngle, setRotationAngle] = useState(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(35);
  const [userPassword, setUserPassword] = useState('');
  const [imgQuality, setImgQuality] = useState(85);
  const [imgBgColor, setImgBgColor] = useState('#FFFFFF');
  const [resizeWidth, setResizeWidth] = useState(1280);
  const [resizeHeight, setResizeHeight] = useState(720);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9' | '9:16'>('free');
  const [bgTolerance, setBgTolerance] = useState(30);
  const [bgFeather, setBgFeather] = useState(10);

  // Text inputs for document/utility tools
  const [textInput, setTextInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Utility tool states
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi' | 'email'>('url');
  const [qrContent, setQrContent] = useState('https://tools-workshop.com');
  const [qrSize, setQrSize] = useState(300);
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [qrResult, setQrResult] = useState<{ dataUrl: string; svg?: string } | null>(null);

  const [passwordLength, setPasswordLength] = useState(16);
  const [passUpper, setPassUpper] = useState(true);
  const [passLower, setPassLower] = useState(true);
  const [passNumbers, setPassNumbers] = useState(true);
  const [passSymbols, setPassSymbols] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');

  const [uuidCount, setUuidCount] = useState(5);
  const [uuidUppercase, setUuidUppercase] = useState(false);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);

  const [jsonIndent, setJsonIndent] = useState<number | 'tab'>(2);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [colorInput, setColorInput] = useState('#E53935');
  const [colorInfo, setColorInfo] = useState(utilityUtils.parseAnyColor('#E53935'));

  const [loremCount, setLoremCount] = useState(3);
  const [loremType, setLoremType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');

  const [timestampInput, setTimestampInput] = useState(Math.floor(Date.now() / 1000).toString());

  // Image color picker state
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic SEO metadata calculation and document head injection
  const seo = getToolSeoMetadata(tool);

  useEffect(() => {
    // 1. Dynamic Page <title> tag update
    const previousTitle = document.title;
    let titleElement = document.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
    }
    titleElement.textContent = seo.title;
    document.title = seo.title;

    // 2. Dynamic <meta name="description"> tag update
    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || '';
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seo.description);

    // 3. Dynamic <meta name="keywords"> tag update
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seo.keywords.join(', '));

    // 4. OpenGraph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', seo.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', seo.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', seo.canonicalUrl);

    // 5. Twitter Card tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', seo.title);

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', seo.description);

    // 6. Canonical <link rel="canonical"> tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', seo.canonicalUrl);

    // 7. Schema.org JSON-LD structured data script
    let schemaScript = document.getElementById('tool-schema-jsonld') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'tool-schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(seo.schema, null, 2);

    return () => {
      // Restore default homepage SEO title and description when leaving this tool view
      const defaultTitle = 'Tools Workshop – Fast, Private & Free Online File Tools';
      const defaultDescription = 'All-in-one fast, private, and secure online utility workshop to merge, split, compress, and convert PDFs, images, documents, and developer utilities.';
      
      document.title = previousTitle || defaultTitle;
      if (titleElement) {
        titleElement.textContent = previousTitle || defaultTitle;
      }
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription || defaultDescription);
      }
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [tool.id, tool.slug, seo.title, seo.description, seo.canonicalUrl, seo.keywords, seo.schema]);

  // Reset state when tool changes
  useEffect(() => {
    setFiles([]);
    setProcessingState({ status: 'idle', progress: 0 });
    setTextInput('');
    setCopied(false);
    setQrResult(null);

    // Initial triggers for interactive utilities
    if (tool.id === 'qr-code-generator') {
      utilityUtils.generateQrCode('https://tools-workshop.com').then((res) => {
        setQrResult({ dataUrl: res.dataUrl, svg: res.svgString });
      });
    } else if (tool.id === 'password-generator') {
      const p = utilityUtils.generatePassword({
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      });
      setGeneratedPass(p.password);
    } else if (tool.id === 'uuid-generator') {
      setGeneratedUuids(utilityUtils.generateMultipleUUIDs(5, false));
    } else if (tool.id === 'lorem-ipsum-generator') {
      setTextInput(utilityUtils.generateLoremIpsum(3, 'paragraphs'));
    }
  }, [tool.id]);

  // Handle image load for color picker & palette
  useEffect(() => {
    if (tool.id === 'image-color-picker' && files.length > 0) {
      imageUtils.extractColorPalette(files[0].file, 8).then((palette) => {
        setExtractedPalette(palette);
      });
    }
  }, [tool.id, files]);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate shareable link for the current tool page
  const generateShareableLink = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}#tool/${tool.slug}`;
    }
    return `https://tools-workshop.com/#tool/${tool.slug}`;
  };

  // Share tool handler - copies shareable link to user's clipboard
  const handleShareTool = async () => {
    const shareUrl = generateShareableLink();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  // -------------------------------------------------------------
  // PRIMARY TOOL PROCESSOR
  // -------------------------------------------------------------
  const handleProcessTool = async () => {
    setProcessingState({ status: 'processing', progress: 10, message: 'Preparing file...' });

    try {
      const file = files[0]?.file;
      const baseName = file ? getFileBaseName(file.name) : 'document';

      // 1. PDF TOOLS
      if (tool.id === 'merge-pdf') {
        if (files.length < 2) {
          throw new Error('Please select at least 2 PDF files to merge.');
        }
        setProcessingState({ status: 'processing', progress: 30, message: 'Merging documents...' });
        const mergedBlob = await pdfUtils.mergePdfs(
          files.map((f) => f.file),
          (p) => setProcessingState((prev) => ({ ...prev, progress: p }))
        );
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: mergedBlob,
          resultFileName: 'merged_document.pdf',
          resultFileSize: mergedBlob.size,
          resultUrl: URL.createObjectURL(mergedBlob),
        });
      } else if (tool.id === 'split-pdf') {
        if (!file) throw new Error('Please upload a PDF file.');
        const result = await pdfUtils.splitPdf(file, splitMode, pageRangeStr, (p) =>
          setProcessingState((prev) => ({ ...prev, progress: p }))
        );
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: result.blob,
          resultFileName: result.filename,
          resultFileSize: result.blob.size,
          resultUrl: URL.createObjectURL(result.blob),
        });
      } else if (tool.id === 'compress-pdf') {
        if (!file) throw new Error('Please upload a PDF file.');
        setProcessingState({ status: 'processing', progress: 40, message: 'Optimizing PDF streams...' });
        const result = await pdfUtils.compressPdf(file);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: result.blob,
          resultFileName: `${baseName}_compressed.pdf`,
          resultFileSize: result.newSize,
          resultUrl: URL.createObjectURL(result.blob),
          metadata: {
            originalSize: result.originalSize,
            newSize: result.newSize,
            reductionPercent: result.reductionPercent,
          },
        });
      } else if (tool.id === 'rotate-pdf') {
        if (!file) throw new Error('Please upload a PDF file.');
        const blob = await pdfUtils.rotatePdf(file, rotationAngle, 'all');
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: blob,
          resultFileName: `${baseName}_rotated.pdf`,
          resultFileSize: blob.size,
          resultUrl: URL.createObjectURL(blob),
        });
      } else if (tool.id === 'extract-pdf-pages') {
        if (!file) throw new Error('Please upload a PDF file.');
        const result = await pdfUtils.splitPdf(file, 'range', pageRangeStr);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: result.blob,
          resultFileName: `${baseName}_extracted.pdf`,
          resultFileSize: result.blob.size,
          resultUrl: URL.createObjectURL(result.blob),
        });
      } else if (tool.id === 'delete-pdf-pages') {
        if (!file) throw new Error('Please upload a PDF file.');
        const pagesToDelete = deletePagesStr
          .split(',')
          .map((p) => parseInt(p.trim(), 10))
          .filter((p) => !isNaN(p));
        const blob = await pdfUtils.deletePdfPages(file, pagesToDelete);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: blob,
          resultFileName: `${baseName}_cleaned.pdf`,
          resultFileSize: blob.size,
          resultUrl: URL.createObjectURL(blob),
        });
      } else if (tool.id === 'rearrange-pdf-pages') {
        if (!file) throw new Error('Please upload a PDF file.');
        const order = rearrangeOrderStr
          .split(',')
          .map((p) => parseInt(p.trim(), 10))
          .filter((p) => !isNaN(p));
        if (order.length === 0) throw new Error('Please provide page sequence numbers (e.g. 3, 1, 2).');
        const blob = await pdfUtils.rearrangePdfPages(file, order);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: blob,
          resultFileName: `${baseName}_rearranged.pdf`,
          resultFileSize: blob.size,
          resultUrl: URL.createObjectURL(blob),
        });
      } else if (tool.id === 'watermark-pdf') {
        if (!file) throw new Error('Please upload a PDF file.');
        const blob = await pdfUtils.watermarkPdf(file, watermarkText, {
          opacity: watermarkOpacity / 100,
        });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: blob,
          resultFileName: `${baseName}_watermarked.pdf`,
          resultFileSize: blob.size,
          resultUrl: URL.createObjectURL(blob),
        });
      } else if (tool.id === 'remove-pdf-metadata') {
        if (!file) throw new Error('Please upload a PDF file.');
        const blob = await pdfUtils.removePdfMetadata(file);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: blob,
          resultFileName: `${baseName}_sanitized.pdf`,
          resultFileSize: blob.size,
          resultUrl: URL.createObjectURL(blob),
        });
      } else if (tool.id === 'pdf-to-word') {
        if (!file) throw new Error('Please upload a PDF file.');
        setProcessingState({ status: 'processing', progress: 30, message: 'Extracting content and building Word .docx...' });
        const docxBlob = await pdfUtils.pdfToWordDocx(file, (p) =>
          setProcessingState((prev) => ({ ...prev, progress: p }))
        );
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: docxBlob,
          resultFileName: `${baseName}.docx`,
          resultFileSize: docxBlob.size,
          resultUrl: URL.createObjectURL(docxBlob),
        });
      } else if (tool.id === 'pdf-to-text') {
        if (!file) throw new Error('Please upload a PDF file.');
        const extractedText = await pdfUtils.extractTextFromPdf(file, (p) =>
          setProcessingState((prev) => ({ ...prev, progress: p }))
        );
        const textBlob = new Blob([extractedText], { type: 'text/plain' });
        setTextInput(extractedText);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: textBlob,
          resultFileName: `${baseName}.txt`,
          resultFileSize: textBlob.size,
          resultUrl: URL.createObjectURL(textBlob),
        });
      } else if (tool.id === 'pdf-to-jpg' || tool.id === 'pdf-to-png') {
        if (!file) throw new Error('Please upload a PDF file.');
        const fmt = tool.id === 'pdf-to-jpg' ? 'image/jpeg' : 'image/png';
        const res = await pdfUtils.pdfToImages(file, fmt, imgQuality / 100, (p) =>
          setProcessingState((prev) => ({ ...prev, progress: p }))
        );
        const firstImg = res.images[0];
        const finalBlob = res.zipBlob || firstImg.blob;
        const ext = tool.id === 'pdf-to-jpg' ? (res.zipBlob ? 'zip' : 'jpg') : res.zipBlob ? 'zip' : 'png';

        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: finalBlob,
          resultFileName: `${baseName}_pages.${ext}`,
          resultFileSize: finalBlob.size,
          resultUrl: URL.createObjectURL(finalBlob),
          resultItems: res.images.map((img) => ({
            name: `${baseName}_page_${img.page}.${tool.id === 'pdf-to-jpg' ? 'jpg' : 'png'}`,
            url: img.url,
            blob: img.blob,
            size: img.blob.size,
          })),
        });
      } else if (
        tool.id === 'jpg-to-pdf' ||
        tool.id === 'png-to-pdf' ||
        tool.id === 'image-to-pdf'
      ) {
        if (files.length === 0) throw new Error('Please select at least one image file.');
        const pdfBlob = await pdfUtils.imagesToPdf(files.map((f) => f.file), {
          pageSize: 'a4',
          orientation: 'portrait',
        });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: pdfBlob,
          resultFileName: `${baseName}_converted.pdf`,
          resultFileSize: pdfBlob.size,
          resultUrl: URL.createObjectURL(pdfBlob),
        });
      } else if (tool.id === 'pdf-to-excel') {
        if (!file) throw new Error('Please upload a PDF file.');
        const text = await pdfUtils.extractTextFromPdf(file);
        // Transform extracted lines into CSV structure
        const csvContent = text
          .split('\n')
          .filter((l) => l.trim())
          .map((l) => `"${l.replace(/"/g, '""')}"`)
          .join('\n');
        const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: csvBlob,
          resultFileName: `${baseName}_extracted.csv`,
          resultFileSize: csvBlob.size,
          resultUrl: URL.createObjectURL(csvBlob),
        });
      }

      // 2. IMAGE TOOLS
      else if (
        tool.id === 'jpg-to-png' ||
        tool.id === 'png-to-jpg' ||
        tool.id === 'jpg-to-webp' ||
        tool.id === 'webp-to-jpg' ||
        tool.id === 'webp-to-png' ||
        tool.id === 'png-to-webp'
      ) {
        if (!file) throw new Error('Please upload an image file.');
        let targetFmt: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png';
        if (tool.id === 'png-to-jpg' || tool.id === 'webp-to-jpg') targetFmt = 'image/jpeg';
        if (tool.id === 'jpg-to-webp' || tool.id === 'png-to-webp') targetFmt = 'image/webp';

        const converted = await imageUtils.convertImage(file, {
          format: targetFmt,
          quality: imgQuality / 100,
          backgroundColor: imgBgColor,
        });

        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: converted.blob,
          resultFileName: converted.filename,
          resultFileSize: converted.newSize,
          resultUrl: converted.url,
          metadata: {
            originalSize: converted.originalSize,
            newSize: converted.newSize,
          },
        });
      } else if (tool.id === 'image-compressor') {
        if (!file) throw new Error('Please upload an image to compress.');
        const result = await imageUtils.compressImage(file, imgQuality / 100);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: result.blob,
          resultFileName: `${baseName}_compressed.${file.name.split('.').pop()}`,
          resultFileSize: result.newSize,
          resultUrl: result.url,
          metadata: {
            originalSize: result.originalSize,
            newSize: result.newSize,
            reductionPercent: result.reductionPercent,
          },
        });
      } else if (tool.id === 'resize-image') {
        if (!file) throw new Error('Please upload an image to resize.');
        const resizedBlob = await imageUtils.resizeImage(
          file,
          resizeWidth,
          resizeHeight,
          maintainAspect,
          'image/png',
          imgQuality / 100
        );
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: resizedBlob,
          resultFileName: `${baseName}_${resizeWidth}x${resizeHeight}.png`,
          resultFileSize: resizedBlob.size,
          resultUrl: URL.createObjectURL(resizedBlob),
        });
      } else if (tool.id === 'crop-image') {
        if (!file) throw new Error('Please upload an image to crop.');
        const img = await imageUtils.loadImageFromFile(file);
        // Default center crop according to selected aspect ratio
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (cropAspect === '1:1') {
          const side = Math.min(w, h);
          w = side;
          h = side;
        } else if (cropAspect === '16:9') {
          h = Math.round((w * 9) / 16);
          if (h > img.naturalHeight) {
            h = img.naturalHeight;
            w = Math.round((h * 16) / 9);
          }
        } else if (cropAspect === '4:3') {
          h = Math.round((w * 3) / 4);
          if (h > img.naturalHeight) {
            h = img.naturalHeight;
            w = Math.round((h * 4) / 3);
          }
        } else if (cropAspect === '9:16') {
          w = Math.round((h * 9) / 16);
          if (w > img.naturalWidth) {
            w = img.naturalWidth;
            h = Math.round((w * 16) / 9);
          }
        }

        const x = Math.round((img.naturalWidth - w) / 2);
        const y = Math.round((img.naturalHeight - h) / 2);

        const croppedBlob = await imageUtils.cropImage(file, { x, y, width: w, height: h });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: croppedBlob,
          resultFileName: `${baseName}_cropped.png`,
          resultFileSize: croppedBlob.size,
          resultUrl: URL.createObjectURL(croppedBlob),
        });
      } else if (tool.id === 'rotate-image') {
        if (!file) throw new Error('Please upload an image.');
        const transformedBlob = await imageUtils.transformImage(file, {
          rotationDegrees: rotationAngle,
        });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: transformedBlob,
          resultFileName: `${baseName}_rotated.png`,
          resultFileSize: transformedBlob.size,
          resultUrl: URL.createObjectURL(transformedBlob),
        });
      } else if (tool.id === 'grayscale-image') {
        if (!file) throw new Error('Please upload an image.');
        const grayBlob = await imageUtils.grayscaleImage(file);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: grayBlob,
          resultFileName: `${baseName}_grayscale.png`,
          resultFileSize: grayBlob.size,
          resultUrl: URL.createObjectURL(grayBlob),
        });
      } else if (tool.id === 'image-watermark') {
        if (!file) throw new Error('Please upload an image.');
        const markedBlob = await imageUtils.addImageWatermark(file, watermarkText, {
          opacity: watermarkOpacity / 100,
        });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: markedBlob,
          resultFileName: `${baseName}_watermarked.png`,
          resultFileSize: markedBlob.size,
          resultUrl: URL.createObjectURL(markedBlob),
        });
      } else if (tool.id === 'background-remover') {
        if (!file) throw new Error('Please upload an image.');
        setProcessingState({ status: 'processing', progress: 40, message: 'Analyzing colors & removing background...' });
        const removedBlob = await imageUtils.removeImageBackground(file, {
          tolerance: bgTolerance,
          feather: bgFeather,
        });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: removedBlob,
          resultFileName: `${baseName}_no_bg.png`,
          resultFileSize: removedBlob.size,
          resultUrl: URL.createObjectURL(removedBlob),
        });
      } else if (tool.id === 'remove-image-metadata') {
        if (!file) throw new Error('Please upload an image.');
        const cleanBlob = await imageUtils.removeImageMetadata(file);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: cleanBlob,
          resultFileName: `${baseName}_sanitized.jpg`,
          resultFileSize: cleanBlob.size,
          resultUrl: URL.createObjectURL(cleanBlob),
        });
      }

      // 3. DOCUMENT TOOLS
      else if (tool.id === 'word-to-pdf') {
        if (!file) throw new Error('Please upload a Microsoft Word (.docx) file.');
        const pdfBlob = await pdfUtils.wordDocxToPdf(file);
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: pdfBlob,
          resultFileName: `${baseName}.pdf`,
          resultFileSize: pdfBlob.size,
          resultUrl: URL.createObjectURL(pdfBlob),
        });
      } else if (tool.id === 'text-to-pdf' || tool.id === 'txt-to-pdf') {
        let content = textInput;
        if (tool.id === 'txt-to-pdf') {
          if (!file) throw new Error('Please upload a .txt file.');
          content = await file.text();
        }
        if (!content.trim()) throw new Error('Please provide text content to generate PDF.');
        const pdfBlob = await pdfUtils.textToPdf(content, { title: baseName });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: pdfBlob,
          resultFileName: `${baseName}.pdf`,
          resultFileSize: pdfBlob.size,
          resultUrl: URL.createObjectURL(pdfBlob),
        });
      } else if (tool.id === 'markdown-to-pdf') {
        if (!textInput.trim()) throw new Error('Please enter Markdown content.');
        const pdfBlob = await pdfUtils.markdownToPdf(textInput, 'Document');
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: pdfBlob,
          resultFileName: 'markdown_document.pdf',
          resultFileSize: pdfBlob.size,
          resultUrl: URL.createObjectURL(pdfBlob),
        });
      } else if (tool.id === 'html-to-pdf') {
        if (!textInput.trim()) throw new Error('Please provide HTML content.');
        // Strip tags for clean text rendering or render
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = textInput;
        const textOnly = tempDiv.innerText || textInput;
        const pdfBlob = await pdfUtils.textToPdf(textOnly, { title: 'HTML Document' });
        setProcessingState({
          status: 'success',
          progress: 100,
          resultBlob: pdfBlob,
          resultFileName: 'html_document.pdf',
          resultFileSize: pdfBlob.size,
          resultUrl: URL.createObjectURL(pdfBlob),
        });
      }
    } catch (err: any) {
      console.error('Operation failed:', err);
      setProcessingState({
        status: 'error',
        progress: 0,
        error: err.message || 'An error occurred during processing. Please verify the file and try again.',
      });
    }
  };

  // -------------------------------------------------------------
  // INTERACTIVE TOOLS DISPATCH
  // -------------------------------------------------------------
  const handleGenerateQr = async () => {
    try {
      const res = await utilityUtils.generateQrCode(qrContent, {
        width: qrSize,
        darkColor: qrFgColor,
        lightColor: qrBgColor,
      });
      setQrResult({ dataUrl: res.dataUrl, svg: res.svgString });
    } catch (e: any) {
      alert('Failed to generate QR code: ' + e.message);
    }
  };

  const handleGeneratePassword = () => {
    const res = utilityUtils.generatePassword({
      length: passwordLength,
      includeUppercase: passUpper,
      includeLowercase: passLower,
      includeNumbers: passNumbers,
      includeSymbols: passSymbols,
    });
    setGeneratedPass(res.password);
  };

  const handleGenerateUuids = () => {
    const list = utilityUtils.generateMultipleUUIDs(uuidCount, uuidUppercase);
    setGeneratedUuids(list);
  };

  const handleFormatJson = (indent: number | 'tab') => {
    setJsonError(null);
    const res = utilityUtils.formatJson(textInput, indent);
    if (res.error) {
      setJsonError(res.error);
    } else if (res.formatted) {
      setTextInput(res.formatted);
    }
  };

  const handleMinifyJson = () => {
    setJsonError(null);
    const res = utilityUtils.minifyJson(textInput);
    if (res.error) setJsonError(res.error);
    else if (res.minified) setTextInput(res.minified);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#777777] mb-6">
        <button
          onClick={onBack}
          className="hover:text-[#E53935] flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span aria-hidden="true" className="text-neutral-300">/</span>
        <button
          onClick={() => onSelectCategory(tool.category)}
          className="hover:text-[#E53935] font-medium transition-colors"
        >
          {tool.categoryLabel}
        </button>
        <span aria-hidden="true" className="text-neutral-300">/</span>
        <span className="text-[#171717] font-bold truncate">{tool.name}</span>
      </div>

      {/* Tool Header Card */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0F0] text-[#E53935] flex items-center justify-center shrink-0 shadow-xs">
              <DynamicIcon name={tool.iconName} className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                {tool.name}
              </h1>
              <p className="text-sm text-[#666666] mt-1 max-w-2xl leading-relaxed">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
            {/* Share Tool Button */}
            <button
              type="button"
              onClick={handleShareTool}
              title={`Share ${tool.name} – Copy link to clipboard`}
              aria-label="Share tool link"
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 shadow-xs cursor-pointer ${
                shareCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-emerald-500/20'
                  : 'bg-white hover:bg-[#FFF7F7] text-[#171717] hover:text-[#E53935] border-[#E5E5E5] hover:border-[#E53935]/30'
              }`}
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 animate-in fade-in" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#E53935]" />
                  <span>Share</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Runs 100% in browser</span>
            </div>
          </div>
        </div>

        {/* SEO Page Title & Searchable Metadata Bar */}
        <div className="mt-5 pt-4 border-t border-[#F5F5F5] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-3.5 h-3.5 text-[#E53935] shrink-0" />
              <span className="font-semibold text-[#171717] shrink-0">Injected &lt;title&gt;:</span>
              <span className="text-[#333333] font-mono text-[11px] font-medium truncate" title={seo.title}>
                {seo.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#888888] shrink-0">
              <span>Canonical: <code className="bg-[#FFF0F0] text-[#E53935] px-1.5 py-0.5 rounded font-mono font-semibold">#tool/{tool.slug}</code></span>
              <span>·</span>
              <button
                type="button"
                onClick={handleShareTool}
                className="text-[#E53935] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                title="Copy shareable link"
              >
                {shareCopied ? (
                  <span className="text-emerald-700 inline-flex items-center gap-1 font-bold">
                    <Check className="w-3 h-3" /> Copied!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Copy Link
                  </span>
                )}
              </button>
              <span>·</span>
              <span className="text-emerald-700 font-medium">Head Tags Active</span>
            </div>
          </div>
          <div className="text-[11px] text-[#666666] flex items-start gap-2 bg-[#FFFDFD] p-2.5 rounded-xl border border-[#F5EEEE]">
            <span className="font-semibold text-[#171717] shrink-0">&lt;meta name="description"&gt;:</span>
            <span className="leading-relaxed line-clamp-2">{seo.description}</span>
          </div>

          {/* Share Link Copied Toast Banner */}
          {shareCopied && (
            <div className="mt-2 py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  Shareable link copied to clipboard: <strong className="font-mono text-emerald-950 font-semibold">{generateShareableLink()}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShareCopied(false)}
                className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-sm leading-none cursor-pointer"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="space-y-8">
        {/* ========================================================= */}
        {/* FILE UPLOAD TOOLS WORKSPACE */}
        {/* ========================================================= */}
        {tool.type === 'file-upload' && (
          <div className="space-y-6">
            {/* Upload Box */}
            <FileUploader
              files={files}
              onFilesChange={(newFiles) => {
                setFiles(newFiles);
                setProcessingState({ status: 'idle', progress: 0 });
              }}
              acceptsMultiple={tool.acceptsMultiple}
              acceptedFormats={tool.acceptedFormats}
              maxFileSizeMb={tool.maxFileSizeMb || 100}
            />

            {/* Custom Tool Controls (Only visible when file is uploaded) */}
            {files.length > 0 && processingState.status !== 'success' && (
              <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#E53935]" />
                  <span>Configure Options</span>
                </h3>

                {/* Split PDF controls */}
                {tool.id === 'split-pdf' && (
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-[#171717] cursor-pointer">
                        <input
                          type="radio"
                          checked={splitMode === 'range'}
                          onChange={() => setSplitMode('range')}
                          className="text-[#E53935] focus:ring-[#E53935]"
                        />
                        <span>Extract specific page range</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#171717] cursor-pointer">
                        <input
                          type="radio"
                          checked={splitMode === 'all'}
                          onChange={() => setSplitMode('all')}
                          className="text-[#E53935] focus:ring-[#E53935]"
                        />
                        <span>Split all pages into individual files (ZIP)</span>
                      </label>
                    </div>
                    {splitMode === 'range' && (
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">
                          Page numbers or range (e.g. 1-3, 5)
                        </label>
                        <input
                          type="text"
                          value={pageRangeStr}
                          onChange={(e) => setPageRangeStr(e.target.value)}
                          className="w-full sm:w-64 px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm focus:outline-none focus:border-[#E53935]"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Delete PDF Pages controls */}
                {tool.id === 'delete-pdf-pages' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1">
                      Pages to delete (comma separated, e.g. 2, 4)
                    </label>
                    <input
                      type="text"
                      value={deletePagesStr}
                      onChange={(e) => setDeletePagesStr(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm focus:outline-none focus:border-[#E53935]"
                    />
                  </div>
                )}

                {/* Rearrange PDF Pages controls */}
                {tool.id === 'rearrange-pdf-pages' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1">
                      New page sequence (e.g. 3, 1, 2)
                    </label>
                    <input
                      type="text"
                      value={rearrangeOrderStr}
                      placeholder="e.g. 2, 1, 3"
                      onChange={(e) => setRearrangeOrderStr(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm focus:outline-none focus:border-[#E53935]"
                    />
                  </div>
                )}

                {/* Rotate PDF / Image controls */}
                {(tool.id === 'rotate-pdf' || tool.id === 'rotate-image') && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-2">
                      Rotation Angle
                    </label>
                    <div className="flex gap-2">
                      {[90, 180, 270].map((angle) => (
                        <button
                          key={angle}
                          type="button"
                          onClick={() => setRotationAngle(angle)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                            rotationAngle === angle
                              ? 'bg-[#E53935] text-white border-[#E53935]'
                              : 'bg-white text-[#555555] border-[#CCCCCC] hover:border-[#E53935]'
                          }`}
                        >
                          {angle}° Clockwise
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watermark controls */}
                {(tool.id === 'watermark-pdf' || tool.id === 'image-watermark') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm focus:outline-none focus:border-[#E53935]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1">
                        Opacity: {watermarkOpacity}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseInt(e.target.value, 10))}
                        className="w-full accent-[#E53935]"
                      />
                    </div>
                  </div>
                )}

                {/* Background color for PNG -> JPG */}
                {tool.id === 'png-to-jpg' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1">
                      Background Color for Transparency:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={imgBgColor}
                        onChange={(e) => setImgBgColor(e.target.value)}
                        className="w-9 h-9 rounded cursor-pointer border border-[#DDD]"
                      />
                      <span className="text-xs font-mono text-[#555555]">{imgBgColor} (Default: White)</span>
                    </div>
                  </div>
                )}

                {/* Image Quality slider */}
                {(tool.id === 'image-compressor' ||
                  tool.id === 'jpg-to-png' ||
                  tool.id === 'png-to-jpg' ||
                  tool.id === 'jpg-to-webp' ||
                  tool.id === 'webp-to-jpg' ||
                  tool.id === 'pdf-to-jpg') && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1">
                      Quality: {imgQuality}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={imgQuality}
                      onChange={(e) => setImgQuality(parseInt(e.target.value, 10))}
                      className="w-full sm:w-72 accent-[#E53935]"
                    />
                  </div>
                )}

                {/* Resize Image controls */}
                {tool.id === 'resize-image' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">Width (px)</label>
                        <input
                          type="number"
                          value={resizeWidth}
                          onChange={(e) => setResizeWidth(parseInt(e.target.value, 10) || 100)}
                          className="w-full px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#555555] mb-1">Height (px)</label>
                        <input
                          type="number"
                          value={resizeHeight}
                          onChange={(e) => setResizeHeight(parseInt(e.target.value, 10) || 100)}
                          className="w-full px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-medium text-[#444444] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintainAspect}
                        onChange={(e) => setMaintainAspect(e.target.checked)}
                        className="text-[#E53935] focus:ring-[#E53935] rounded"
                      />
                      <span>Lock aspect ratio</span>
                    </label>
                    <div>
                      <span className="text-xs text-[#777777] block mb-2 font-medium">Quick Presets:</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Instagram (1080×1080)', w: 1080, h: 1080 },
                          { label: 'Story/Reel (1080×1920)', w: 1080, h: 1920 },
                          { label: 'YouTube Thumb (1280×720)', w: 1280, h: 720 },
                          { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setResizeWidth(preset.w);
                              setResizeHeight(preset.h);
                            }}
                            className="px-2.5 py-1 text-xs bg-[#FFF7F7] hover:bg-[#FFE8E8] text-[#E53935] rounded-lg border border-[#F5D8D8] font-medium"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Crop Aspect Ratio Selector */}
                {tool.id === 'crop-image' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-2">
                      Crop Framing Preset
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['free', '1:1', '4:3', '16:9', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setCropAspect(ratio)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            cropAspect === ratio
                              ? 'bg-[#E53935] text-white border-[#E53935]'
                              : 'bg-white text-[#555555] border-[#CCCCCC] hover:border-[#E53935]'
                          }`}
                        >
                          {ratio === 'free' ? 'Original Fit' : ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Background remover tolerance */}
                {tool.id === 'background-remover' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1">
                        Erase Sensitivity / Tolerance: {bgTolerance}%
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={bgTolerance}
                        onChange={(e) => setBgTolerance(parseInt(e.target.value, 10))}
                        className="w-full sm:w-72 accent-[#E53935]"
                      />
                    </div>
                    <p className="text-xs text-[#777777]">
                      Automatically detects background pixels from the image borders and isolates the foreground subject into a transparent PNG.
                    </p>
                  </div>
                )}

                {/* Color picker inspection */}
                {tool.id === 'image-color-picker' && files[0]?.previewUrl && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#666666]">
                      Click anywhere on the image below to inspect color values:
                    </p>
                    <div className="relative inline-block border border-[#DDD] rounded-xl overflow-hidden bg-[radial-gradient(#DDD_1px,transparent_1px)] [background-size:12px_12px]">
                      <img
                        src={files[0].previewUrl}
                        alt="Inspect"
                        className="max-h-80 object-contain cursor-crosshair"
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = Math.floor(((e.clientX - rect.left) / rect.width) * e.currentTarget.naturalWidth);
                          const y = Math.floor(((e.clientY - rect.top) / rect.height) * e.currentTarget.naturalHeight);
                          const canvas = document.createElement('canvas');
                          canvas.width = e.currentTarget.naturalWidth;
                          canvas.height = e.currentTarget.naturalHeight;
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            ctx.drawImage(e.currentTarget, 0, 0);
                            const p = ctx.getImageData(x, y, 1, 1).data;
                            const hex = utilityUtils.parseAnyColor(`rgb(${p[0]}, ${p[1]}, ${p[2]})`).hex;
                            setPickedColor(hex);
                          }
                        }}
                      />
                    </div>
                    {pickedColor && (
                      <div className="flex items-center gap-3 p-3 bg-[#FFF7F7] border border-[#F5DCDC] rounded-xl max-w-sm">
                        <div
                          className="w-8 h-8 rounded-lg border border-[#DDD]"
                          style={{ backgroundColor: pickedColor }}
                        />
                        <div>
                          <p className="text-xs font-bold text-[#171717]">{pickedColor}</p>
                          <p className="text-[11px] text-[#777777]">Click to copy color code</p>
                        </div>
                        <button
                          onClick={() => handleCopy(pickedColor)}
                          className="ml-auto p-1.5 text-[#E53935] hover:bg-red-100 rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {extractedPalette.length > 0 && (
                      <div>
                        <span className="text-xs font-semibold text-[#555555] block mb-2">
                          Dominant Image Palette:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {extractedPalette.map((color) => (
                            <button
                              key={color}
                              onClick={() => handleCopy(color)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E0E0E0] bg-white hover:border-[#E53935] transition-all text-xs"
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-black/10 inline-block"
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-mono text-[11px]">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleProcessTool}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Process {tool.name}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {processingState.status === 'processing' && (
              <div className="bg-white rounded-2xl border border-[#EEEEEE] p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#FFF0F0] border-t-[#E53935] animate-spin mx-auto" />
                <h4 className="text-base font-bold text-[#171717]">
                  {processingState.message || 'Processing file...'}
                </h4>
                <div className="w-full max-w-md mx-auto bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#E53935] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingState.progress}%` }}
                  />
                </div>
                <p className="text-xs text-[#888888]">
                  Processing safely within your local web browser session
                </p>
              </div>
            )}

            {/* Error Message */}
            {processingState.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                <h4 className="text-sm sm:text-base font-bold text-red-900">
                  Operation could not be completed
                </h4>
                <p className="text-xs sm:text-sm text-red-700 max-w-lg mx-auto">
                  {processingState.error}
                </p>
                <button
                  type="button"
                  onClick={() => setProcessingState({ status: 'idle', progress: 0 })}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* SUCCESS / DOWNLOAD VIEW */}
            {processingState.status === 'success' && processingState.resultBlob && (
              <div className="bg-white rounded-2xl border-2 border-emerald-500/20 p-6 sm:p-8 space-y-6 shadow-xl shadow-emerald-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#171717]">
                      Processing Completed Successfully!
                    </h3>
                    <p className="text-xs text-[#666666]">
                      Your file is ready. Download it immediately below.
                    </p>
                  </div>
                </div>

                {/* Reduction metrics if compression tool */}
                {processingState.metadata?.reductionPercent !== undefined && (
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                    <div>
                      <span className="text-[11px] text-[#666666] block">Original Size</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-[#171717]">
                        {formatBytes(processingState.metadata.originalSize)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#666666] block">Compressed Size</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-emerald-700">
                        {formatBytes(processingState.metadata.newSize)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#666666] block">Reduction</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-emerald-700">
                        -{processingState.metadata.reductionPercent}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Result Preview (Image or generic info) */}
                {processingState.resultUrl && (
                  <div className="p-4 bg-[#FAF9F9] rounded-xl border border-[#EEEEEE] flex flex-col items-center">
                    {processingState.resultFileName?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                      <img
                        src={processingState.resultUrl}
                        alt="Result Preview"
                        className="max-h-72 object-contain rounded-lg border border-[#DDD] shadow-xs"
                      />
                    ) : (
                      <div className="flex items-center gap-3 py-4">
                        <FileCheck className="w-8 h-8 text-[#E53935]" />
                        <div>
                          <p className="text-sm font-bold text-[#171717]">
                            {processingState.resultFileName}
                          </p>
                          <p className="text-xs text-[#888888] font-mono">
                            {formatBytes(processingState.resultFileSize || 0)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Gallery of multiple images (PDF to images) */}
                {processingState.resultItems && processingState.resultItems.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                      Extracted Pages ({processingState.resultItems.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {processingState.resultItems.map((item, idx) => (
                        <div key={idx} className="p-2 bg-[#FFF] border border-[#DDD] rounded-xl text-center space-y-2">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="h-28 object-contain mx-auto rounded border border-[#EEE]"
                          />
                          <p className="text-[11px] font-semibold text-[#171717] truncate">{item.name}</p>
                          <button
                            onClick={() => downloadBlob(item.blob, item.name)}
                            className="text-[11px] text-[#E53935] hover:underline font-bold"
                          >
                            Download Page {idx + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted text viewer if PDF to Text */}
                {tool.id === 'pdf-to-text' && textInput && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
                        Extracted Text Content
                      </span>
                      <button
                        onClick={() => handleCopy(textInput)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#E53935]"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={textInput}
                      rows={8}
                      className="w-full p-3 bg-white border border-[#CCCCCC] rounded-xl text-xs font-mono text-[#171717]"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadBlob(
                        processingState.resultBlob!,
                        processingState.resultFileName || 'download'
                      )
                    }
                    className="px-6 py-3.5 bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/25 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {processingState.resultFileName}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProcessingState({ status: 'idle', progress: 0 });
                      setFiles([]);
                    }}
                    className="px-5 py-3.5 bg-white hover:bg-[#FFF7F7] text-[#555555] hover:text-[#171717] text-sm font-bold rounded-xl border border-[#EEEEEE] transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Process Another File</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareTool}
                    className="px-4 py-3.5 bg-white hover:bg-[#FFF7F7] text-[#555555] hover:text-[#E53935] text-sm font-bold rounded-xl border border-[#EEEEEE] transition-all flex items-center gap-2 cursor-pointer ml-auto"
                    title={`Share ${tool.name}`}
                  >
                    {shareCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-[#E53935]" />
                        <span>Share Tool</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TEXT INPUT DOCUMENT TOOLS (e.g. Markdown/HTML/Text to PDF) */}
        {/* ========================================================= */}
        {tool.type === 'text-input' && (
          <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#171717] mb-1">
                Enter or Paste Content
              </label>
              <p className="text-xs text-[#666666] mb-3">
                {tool.id === 'markdown-to-pdf'
                  ? 'Supports # Headings, - bullet lists, bold text, and code blocks.'
                  : 'Type or paste plain text. Will be paginated and formatted automatically.'}
              </p>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  tool.id === 'markdown-to-pdf'
                    ? '# Project Overview\n\nThis is a summary of the project.\n\n- Key feature 1\n- Key feature 2'
                    : 'Paste your document text here...'
                }
                rows={10}
                className="w-full p-4 border border-[#CCCCCC] rounded-xl text-sm font-mono text-[#171717] focus:outline-none focus:border-[#E53935]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleProcessTool}
                className="px-6 py-3 bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate PDF Document</span>
              </button>
              {textInput && (
                <button
                  type="button"
                  onClick={() => setTextInput('')}
                  className="px-4 py-3 text-xs font-semibold text-[#888888] hover:text-[#171717]"
                >
                  Clear Text
                </button>
              )}
            </div>

            {/* Result Download if generated */}
            {processingState.status === 'success' && processingState.resultBlob && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-950">PDF Document Ready</span>
                </div>
                <button
                  onClick={() =>
                    downloadBlob(processingState.resultBlob!, processingState.resultFileName!)
                  }
                  className="px-4 py-2 bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* INTERACTIVE DEVELOPER & UTILITY TOOLS */}
        {/* ========================================================= */}
        {tool.type === 'interactive' && (
          <div className="bg-white rounded-2xl border border-[#EEEEEE] p-6 sm:p-8 space-y-6">
            {/* 1. QR CODE GENERATOR */}
            {tool.id === 'qr-code-generator' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#555555] mb-2">
                      Type & Payload
                    </label>
                    <div className="flex gap-2 mb-3">
                      {(['url', 'text', 'wifi', 'email'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setQrType(t);
                            if (t === 'wifi') setQrContent('WIFI:S:MyNetwork;T:WPA;P:Password123;;');
                            else if (t === 'email') setQrContent('mailto:contact@example.com?subject=Hello');
                            else if (t === 'url') setQrContent('https://tools-workshop.com');
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border uppercase transition-all ${
                            qrType === t
                              ? 'bg-[#E53935] text-white border-[#E53935]'
                              : 'bg-[#FFF7F7] text-[#555555] border-[#DDD]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={qrContent}
                      onChange={(e) => setQrContent(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-[#CCCCCC] rounded-xl text-sm focus:outline-none focus:border-[#E53935]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1">
                        QR Color:
                      </label>
                      <input
                        type="color"
                        value={qrFgColor}
                        onChange={(e) => setQrFgColor(e.target.value)}
                        className="w-full h-9 rounded cursor-pointer border border-[#DDD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#555555] mb-1">
                        Background:
                      </label>
                      <input
                        type="color"
                        value={qrBgColor}
                        onChange={(e) => setQrBgColor(e.target.value)}
                        className="w-full h-9 rounded cursor-pointer border border-[#DDD]"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateQr}
                    className="w-full py-3 bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/20"
                  >
                    Generate QR Code
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-[#FAF9F9] rounded-2xl border border-[#EEEEEE]">
                  {qrResult ? (
                    <div className="space-y-4 text-center">
                      <img
                        src={qrResult.dataUrl}
                        alt="QR Code"
                        className="w-56 h-56 rounded-xl border border-[#DDD] shadow-sm bg-white p-2"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = qrResult.dataUrl;
                            a.download = 'qrcode.png';
                            a.click();
                          }}
                          className="px-4 py-2 bg-[#E53935] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PNG</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <QrCode className="w-20 h-20 text-[#CCCCCC]" />
                  )}
                </div>
              </div>
            )}

            {/* 2. PASSWORD GENERATOR */}
            {tool.id === 'password-generator' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="relative flex items-center bg-[#FFF7F7] border border-[#F5D8D8] rounded-xl p-3 sm:p-4">
                  <span className="font-mono text-lg sm:text-2xl font-bold text-[#171717] tracking-wider select-all truncate pr-16">
                    {generatedPass}
                  </span>
                  <button
                    onClick={() => handleCopy(generatedPass)}
                    className="absolute right-3 px-3 py-1.5 bg-[#E53935] text-white rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-xl border border-[#EEEEEE]">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[#555555] mb-1">
                      <span>Length</span>
                      <span className="font-mono tabular-nums">{passwordLength} characters</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
                      className="w-full accent-[#E53935]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-[#444444]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passUpper}
                        onChange={(e) => setPassUpper(e.target.checked)}
                        className="text-[#E53935] rounded"
                      />
                      <span>Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passLower}
                        onChange={(e) => setPassLower(e.target.checked)}
                        className="text-[#E53935] rounded"
                      />
                      <span>Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passNumbers}
                        onChange={(e) => setPassNumbers(e.target.checked)}
                        className="text-[#E53935] rounded"
                      />
                      <span>Numbers (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={passSymbols}
                        onChange={(e) => setPassSymbols(e.target.checked)}
                        className="text-[#E53935] rounded"
                      />
                      <span>Symbols (!@#$)</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="w-full py-3.5 bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate New Password</span>
                </button>
              </div>
            )}

            {/* 3. UUID GENERATOR */}
            {tool.id === 'uuid-generator' && (
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-[#555555] mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={uuidCount}
                      onChange={(e) => setUuidCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm"
                    />
                  </div>
                  <div className="pt-5">
                    <label className="flex items-center gap-2 text-xs font-medium text-[#444444] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uuidUppercase}
                        onChange={(e) => setUuidUppercase(e.target.checked)}
                        className="text-[#E53935] rounded"
                      />
                      <span>Uppercase UUIDs</span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateUuids}
                  className="w-full py-3 bg-[#E53935] hover:bg-[#C62828] text-white text-sm font-bold rounded-xl"
                >
                  Generate UUIDs
                </button>

                <div className="bg-[#FAF9F9] border border-[#EEEEEE] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#777777]">Generated Identifiers:</span>
                    <button
                      onClick={() => handleCopy(generatedUuids.join('\n'))}
                      className="text-xs font-semibold text-[#E53935] hover:underline"
                    >
                      Copy All
                    </button>
                  </div>
                  {generatedUuids.map((id, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopy(id)}
                      className="p-2 bg-white rounded-lg border border-[#EAEAEA] font-mono text-xs text-[#171717] hover:border-[#E53935] cursor-pointer flex justify-between items-center"
                    >
                      <span>{id}</span>
                      <Copy className="w-3.5 h-3.5 text-[#AAA]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. JSON FORMATTER & VALIDATOR */}
            {(tool.id === 'json-formatter' || tool.id === 'json-validator') && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFormatJson(2)}
                      className="px-3 py-1.5 bg-[#FFF0F0] text-[#E53935] rounded-lg text-xs font-bold hover:bg-[#FFE0E0]"
                    >
                      Format 2 Spaces
                    </button>
                    <button
                      onClick={() => handleFormatJson(4)}
                      className="px-3 py-1.5 bg-[#FFF0F0] text-[#E53935] rounded-lg text-xs font-bold hover:bg-[#FFE0E0]"
                    >
                      Format 4 Spaces
                    </button>
                    <button
                      onClick={handleMinifyJson}
                      className="px-3 py-1.5 bg-neutral-100 text-[#333333] rounded-lg text-xs font-bold hover:bg-neutral-200"
                    >
                      Minify JSON
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(textInput)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#E53935] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => setTextInput('')}
                      className="px-3 py-1.5 text-xs text-[#888888] hover:text-red-600"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    setJsonError(null);
                  }}
                  placeholder='{"name": "Tools Workshop", "secure": true, "items": [1, 2, 3]}'
                  rows={12}
                  className="w-full p-4 border border-[#CCCCCC] rounded-xl text-xs sm:text-sm font-mono text-[#171717] focus:outline-none focus:border-[#E53935]"
                />

                {jsonError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-mono">
                    ⚠️ Syntax Error: {jsonError}
                  </div>
                ) : textInput.trim() ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Valid JSON format</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* 5. WORD & CHARACTER COUNTER */}
            {(tool.id === 'word-counter' || tool.id === 'character-counter') && (
              <div className="space-y-6">
                {(() => {
                  const stats = utilityUtils.calculateTextStats(textInput);
                  return (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-4 bg-[#FFF7F7] border border-[#F5D8D8] rounded-xl text-center">
                          <span className="text-2xl sm:text-3xl font-black text-[#E53935] font-mono tabular-nums">
                            {stats.words}
                          </span>
                          <span className="block text-xs font-bold text-[#666666] mt-1">Words</span>
                        </div>
                        <div className="p-4 bg-white border border-[#EEEEEE] rounded-xl text-center">
                          <span className="text-2xl sm:text-3xl font-black text-[#171717] font-mono tabular-nums">
                            {stats.characters}
                          </span>
                          <span className="block text-xs font-bold text-[#666666] mt-1">Characters</span>
                        </div>
                        <div className="p-4 bg-white border border-[#EEEEEE] rounded-xl text-center">
                          <span className="text-2xl sm:text-3xl font-black text-[#171717] font-mono tabular-nums">
                            {stats.sentences}
                          </span>
                          <span className="block text-xs font-bold text-[#666666] mt-1">Sentences</span>
                        </div>
                        <div className="p-4 bg-white border border-[#EEEEEE] rounded-xl text-center">
                          <span className="text-2xl sm:text-3xl font-black text-[#171717] font-mono tabular-nums">
                            {stats.readingTimeMinutes} min
                          </span>
                          <span className="block text-xs font-bold text-[#666666] mt-1">Reading Time</span>
                        </div>
                      </div>

                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type or paste your text here to analyze word count, characters, sentences, and reading duration..."
                        rows={10}
                        className="w-full p-4 border border-[#CCCCCC] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#E53935]"
                      />
                    </>
                  );
                })()}
              </div>
            )}

            {/* 6. CASE CONVERTER */}
            {tool.id === 'case-converter' && (
              <div className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text to convert case..."
                  rows={6}
                  className="w-full p-4 border border-[#CCCCCC] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#E53935]"
                />

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'UPPERCASE', case: 'uppercase' as const },
                    { label: 'lowercase', case: 'lowercase' as const },
                    { label: 'Title Case', case: 'titlecase' as const },
                    { label: 'Sentence case', case: 'sentencecase' as const },
                    { label: 'camelCase', case: 'camelcase' as const },
                    { label: 'snake_case', case: 'snakecase' as const },
                    { label: 'kebab-case', case: 'kebabcase' as const },
                    { label: 'CONSTANT_CASE', case: 'constantcase' as const },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setTextInput(utilityUtils.convertCase(textInput, item.case))}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#FFF7F7] text-[#E53935] hover:bg-[#FFE8E8] border border-[#F5D8D8] transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCopy(textInput)}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#E53935] text-white hover:bg-[#C62828] ml-auto"
                  >
                    Copy Converted Text
                  </button>
                </div>
              </div>
            )}

            {/* 7. BASE64 & URL ENCODER/DECODER */}
            {(tool.id === 'base64-encoder' ||
              tool.id === 'base64-decoder' ||
              tool.id === 'url-encoder' ||
              tool.id === 'url-decoder') && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (tool.id.includes('base64')) {
                        setTextInput(utilityUtils.encodeBase64(textInput));
                      } else {
                        setTextInput(utilityUtils.encodeUrl(textInput, true));
                      }
                    }}
                    className="px-4 py-2 bg-[#E53935] text-white text-xs font-bold rounded-xl hover:bg-[#C62828]"
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => {
                      if (tool.id.includes('base64')) {
                        setTextInput(utilityUtils.decodeBase64(textInput));
                      } else {
                        setTextInput(utilityUtils.decodeUrl(textInput));
                      }
                    }}
                    className="px-4 py-2 bg-neutral-100 text-[#333] text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Decode
                  </button>
                  <button
                    onClick={() => handleCopy(textInput)}
                    className="px-4 py-2 text-xs font-semibold text-[#E53935] hover:underline ml-auto"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste string to encode or decode..."
                  rows={8}
                  className="w-full p-4 border border-[#CCCCCC] rounded-xl text-xs sm:text-sm font-mono text-[#171717]"
                />
              </div>
            )}

            {/* 8. COLOR CONVERTER */}
            {tool.id === 'color-converter' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF7F7] border border-[#F5D8D8]">
                  <input
                    type="color"
                    value={colorInfo.hex}
                    onChange={(e) => {
                      setColorInput(e.target.value);
                      setColorInfo(utilityUtils.parseAnyColor(e.target.value));
                    }}
                    className="w-16 h-16 rounded-xl cursor-pointer border border-[#DDD]"
                  />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#555555] mb-1">Color Input (HEX or RGB)</label>
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => {
                        setColorInput(e.target.value);
                        setColorInfo(utilityUtils.parseAnyColor(e.target.value));
                      }}
                      className="w-full px-3 py-2 border border-[#CCCCCC] rounded-xl text-sm font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'HEX', val: colorInfo.hex },
                    { label: 'RGB', val: `rgb(${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b})` },
                    { label: 'HSL', val: `hsl(${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%)` },
                    { label: 'CMYK', val: `cmyk(${colorInfo.cmyk.c}%, ${colorInfo.cmyk.m}%, ${colorInfo.cmyk.y}%, ${colorInfo.cmyk.k}%)` },
                  ].map((fmt) => (
                    <div
                      key={fmt.label}
                      onClick={() => handleCopy(fmt.val)}
                      className="p-3 bg-white border border-[#E0E0E0] rounded-xl hover:border-[#E53935] cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#888888] uppercase block">{fmt.label}</span>
                        <span className="text-xs font-mono font-bold text-[#171717]">{fmt.val}</span>
                      </div>
                      <Copy className="w-3.5 h-3.5 text-[#AAA]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. TIMESTAMP CONVERTER */}
            {tool.id === 'timestamp-converter' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div>
                  <label className="block text-xs font-bold text-[#555555] mb-1">Unix Timestamp (Seconds or ms)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={timestampInput}
                      onChange={(e) => setTimestampInput(e.target.value)}
                      className="w-full px-3 py-2.5 border border-[#CCCCCC] rounded-xl font-mono text-sm"
                    />
                    <button
                      onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}
                      className="px-3 py-2 bg-[#FFF0F0] text-[#E53935] text-xs font-bold rounded-xl whitespace-nowrap"
                    >
                      Now
                    </button>
                  </div>
                </div>

                {(() => {
                  const res = utilityUtils.convertTimestamp(timestampInput);
                  return (
                    <div className="bg-[#FAF9F9] border border-[#EEEEEE] rounded-xl p-4 space-y-3">
                      <div>
                        <span className="text-[11px] text-[#777777] block">UTC Formatted</span>
                        <span className="text-sm font-bold text-[#171717]">{res.utcDate}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#777777] block">Local Time</span>
                        <span className="text-sm font-bold text-[#171717]">{res.localDate}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#777777] block">Relative Time</span>
                        <span className="text-xs font-medium text-[#E53935]">{res.relative}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 10. LOREM IPSUM GENERATOR */}
            {tool.id === 'lorem-ipsum-generator' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1">Count</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={loremCount}
                      onChange={(e) => setLoremCount(parseInt(e.target.value, 10) || 1)}
                      className="w-24 px-3 py-1.5 border border-[#CCCCCC] rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#555555] mb-1">Type</label>
                    <div className="flex gap-1.5">
                      {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setLoremType(t);
                            setTextInput(utilityUtils.generateLoremIpsum(loremCount, t));
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border capitalize ${
                            loremType === t
                              ? 'bg-[#E53935] text-white border-[#E53935]'
                              : 'bg-white text-[#555555] border-[#DDD]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setTextInput(utilityUtils.generateLoremIpsum(loremCount, loremType))}
                    className="mt-5 px-4 py-2 bg-[#E53935] text-white rounded-xl text-xs font-bold"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => handleCopy(textInput)}
                    className="mt-5 ml-auto text-xs font-bold text-[#E53935] hover:underline"
                  >
                    Copy Text
                  </button>
                </div>
                <textarea
                  readOnly
                  value={textInput}
                  rows={8}
                  className="w-full p-4 border border-[#CCCCCC] rounded-xl text-sm text-[#171717] bg-[#FAF9F9]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

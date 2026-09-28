import { getFileBaseName } from './fileHelpers';

export interface ImageConvertOptions {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality?: number; // 0.1 to 1.0
  backgroundColor?: string; // used for PNG -> JPG
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  newSize: number;
  reductionPercent: number;
  width: number;
  height: number;
  url: string;
}

/**
 * Loads an image file into an HTMLImageElement
 */
export function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image. The file may be corrupted or unsupported.'));
    };
    img.src = url;
  });
}

/**
 * Convert an image file to another format with custom quality and background
 */
export async function convertImage(
  file: File,
  options: ImageConvertOptions
): Promise<{ blob: Blob; filename: string; url: string; originalSize: number; newSize: number }> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');

  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (options.maxWidth && targetWidth > options.maxWidth) {
    const scale = options.maxWidth / targetWidth;
    targetWidth = options.maxWidth;
    targetHeight = Math.round(targetHeight * scale);
  }
  if (options.maxHeight && targetHeight > options.maxHeight) {
    const scale = options.maxHeight / targetHeight;
    targetHeight = options.maxHeight;
    targetWidth = Math.round(targetWidth * scale);
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // If output format is JPEG, draw background color first because JPEG does not support transparency
  if (options.format === 'image/jpeg') {
    ctx.fillStyle = options.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const quality = options.quality ?? 0.92;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to encode image to desired format'));
      },
      options.format,
      quality
    );
  });

  const ext = options.format === 'image/jpeg' ? 'jpg' : options.format === 'image/png' ? 'png' : 'webp';
  const baseName = getFileBaseName(file.name);
  const filename = `${baseName}.${ext}`;
  const url = URL.createObjectURL(blob);

  return {
    blob,
    filename,
    url,
    originalSize: file.size,
    newSize: blob.size,
  };
}

/**
 * Compress image with quality control and optional dimensions limit
 */
export async function compressImage(
  file: File,
  quality: number = 0.75,
  maxWidth?: number,
  maxHeight?: number,
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'
): Promise<CompressResult> {
  const originalSize = file.size;
  const img = await loadImageFromFile(file);

  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (maxWidth && targetWidth > maxWidth) {
    const scale = maxWidth / targetWidth;
    targetWidth = maxWidth;
    targetHeight = Math.round(targetHeight * scale);
  }
  if (maxHeight && targetHeight > maxHeight) {
    const scale = maxHeight / targetHeight;
    targetHeight = maxHeight;
    targetWidth = Math.round(targetWidth * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // Determine output format based on input or override
  let format = outputFormat;
  if (!format) {
    if (file.type === 'image/png') format = 'image/png';
    else if (file.type === 'image/webp') format = 'image/webp';
    else format = 'image/jpeg';
  }

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to compress image'));
      },
      format,
      quality
    );
  });

  const newSize = blob.size;
  const reductionPercent = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    blob,
    originalSize,
    newSize,
    reductionPercent,
    width: targetWidth,
    height: targetHeight,
    url: URL.createObjectURL(blob),
  };
}

/**
 * Resize image to exact dimensions or preset
 */
export async function resizeImage(
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = false,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
  quality: number = 0.92
): Promise<Blob> {
  const img = await loadImageFromFile(file);

  let finalWidth = width;
  let finalHeight = height;

  if (maintainAspectRatio) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (width / height > ratio) {
      finalWidth = Math.round(height * ratio);
    } else {
      finalHeight = Math.round(width / ratio);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, finalWidth, finalHeight);
  }

  // Smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to resize image'));
      },
      format,
      quality
    );
  });
}

/**
 * Crop image to specific bounding box
 */
export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
  quality: number = 0.95
): Promise<Blob> {
  const img = await loadImageFromFile(file);

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, cropArea.width);
  canvas.height = Math.max(1, cropArea.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to crop image'));
      },
      format,
      quality
    );
  });
}

/**
 * Rotate and/or flip image
 */
export async function transformImage(
  file: File,
  options: {
    rotationDegrees?: number; // 0, 90, 180, 270
    flipHorizontal?: boolean;
    flipVertical?: boolean;
  }
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const angle = (options.rotationDegrees || 0) % 360;

  const canvas = document.createElement('canvas');
  const isSwap = angle === 90 || angle === 270;
  canvas.width = isSwap ? img.naturalHeight : img.naturalWidth;
  canvas.height = isSwap ? img.naturalWidth : img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();

  const isPng = file.type === 'image/png';
  const format = isPng ? 'image/png' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to transform image'));
      },
      format,
      0.95
    );
  });
}

/**
 * Convert image to grayscale with optional brightness/contrast adjustment
 */
export async function grayscaleImage(
  file: File,
  brightness: number = 0, // -100 to 100
  contrast: number = 0 // -100 to 100
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < d.length; i += 4) {
    // Standard Luminance weights
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    let val = factor * (gray - 128) + 128 + brightness;
    val = Math.max(0, Math.min(255, val));

    d[i] = val;
    d[i + 1] = val;
    d[i + 2] = val;
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to process grayscale image'));
      },
      'image/png'
    );
  });
}

/**
 * Add watermark text over image
 */
export async function addImageWatermark(
  file: File,
  watermarkText: string,
  options: {
    fontSize?: number;
    color?: string;
    opacity?: number;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'diagonal';
  } = {}
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(img, 0, 0);

  const fontSize = options.fontSize ?? Math.round(canvas.width / 22);
  const opacity = options.opacity ?? 0.45;
  const color = options.color ?? '#FFFFFF';
  const pos = options.position ?? 'diagonal';
  const text = watermarkText.trim() || 'Tools Workshop';

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;

  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  if (pos === 'diagonal') {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  } else {
    ctx.textBaseline = 'middle';
    let x = 30;
    let y = 30;
    if (pos === 'center') {
      x = (canvas.width - textWidth) / 2;
      y = canvas.height / 2;
    } else if (pos === 'top-left') {
      x = 40;
      y = 40 + fontSize / 2;
    } else if (pos === 'top-right') {
      x = canvas.width - textWidth - 40;
      y = 40 + fontSize / 2;
    } else if (pos === 'bottom-left') {
      x = 40;
      y = canvas.height - 40 - fontSize / 2;
    } else if (pos === 'bottom-right') {
      x = canvas.width - textWidth - 40;
      y = canvas.height - 40 - fontSize / 2;
    }
    ctx.fillText(text, x, y);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to add watermark'));
      },
      'image/png'
    );
  });
}

/**
 * Remove image background locally via color-distance & alpha matting
 */
export async function removeImageBackground(
  file: File,
  options: {
    targetColor?: { r: number; g: number; b: number };
    tolerance?: number; // 0 to 100
    feather?: number; // 0 to 10
  } = {}
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  // Determine target background color: either custom, or sample the 4 corners
  let targetR = options.targetColor?.r;
  let targetG = options.targetColor?.g;
  let targetB = options.targetColor?.b;

  if (targetR === undefined || targetG === undefined || targetB === undefined) {
    // Sample corners (0,0), (w-1, 0), (0, h-1), (w-1, h-1)
    const corners = [
      0, // top-left
      (canvas.width - 1) * 4, // top-right
      ((canvas.height - 1) * canvas.width) * 4, // bottom-left
      ((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4, // bottom-right
    ];
    let sumR = 0, sumG = 0, sumB = 0;
    for (const c of corners) {
      sumR += d[c];
      sumG += d[c + 1];
      sumB += d[c + 2];
    }
    targetR = Math.round(sumR / 4);
    targetG = Math.round(sumG / 4);
    targetB = Math.round(sumB / 4);
  }

  const tolerance = (options.tolerance ?? 30) * 2.55; // scale to 0-255 range
  const feather = options.feather ?? 15;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];

    const dist = Math.sqrt(
      (r - targetR) * (r - targetR) +
      (g - targetG) * (g - targetG) +
      (b - targetB) * (b - targetB)
    );

    if (dist < tolerance) {
      // Background pixel
      if (feather > 0 && dist > tolerance - feather) {
        // Soft feather edge
        const alpha = (dist - (tolerance - feather)) / feather;
        d[i + 3] = Math.round(d[i + 3] * alpha);
      } else {
        d[i + 3] = 0;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to remove background'));
      },
      'image/png'
    );
  });
}

/**
 * Strip metadata completely by re-encoding canvas
 */
export async function removeImageMetadata(file: File): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.drawImage(img, 0, 0);

  const isPng = file.type === 'image/png';
  const format = isPng ? 'image/png' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to strip image metadata'));
      },
      format,
      0.95
    );
  });
}

/**
 * Extract dominant color palette from image
 */
export async function extractColorPalette(file: File, maxColors: number = 6): Promise<string[]> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  // Small sample canvas for fast palette extraction
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#FFFFFF', '#000000'];

  ctx.drawImage(img, 0, 0, 100, 100);
  const data = ctx.getImageData(0, 0, 100, 100).data;
  const colorMap: Record<string, number> = {};

  for (let i = 0; i < data.length; i += 16) {
    if (data[i + 3] < 128) continue; // skip transparent
    // Quantize color to 16-level buckets
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const hex = rgbToHex(r, g, b);
    colorMap[hex] = (colorMap[hex] || 0) + 1;
  }

  const sorted = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map((item) => item[0]);

  return sorted.length > 0 ? sorted : ['#E53935', '#FFFFFF', '#171717'];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

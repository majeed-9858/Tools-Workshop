export type ToolCategory = 'pdf' | 'image' | 'document' | 'utility';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  categoryLabel: string;
  iconName: string;
  popular?: boolean;
  acceptedFormats?: string[];
  acceptsMultiple?: boolean;
  maxFiles?: number;
  maxFileSizeMb?: number; // default 50MB
  type: 'file-upload' | 'text-input' | 'interactive';
  keywords: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number; // 0 - 100
  message?: string;
  error?: string;
  resultBlob?: Blob;
  resultUrl?: string;
  resultFileName?: string;
  resultFileSize?: number;
  resultItems?: { name: string; url: string; blob: Blob; size: number }[];
  metadata?: Record<string, any>;
}

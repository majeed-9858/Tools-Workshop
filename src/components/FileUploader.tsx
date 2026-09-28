import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, ArrowUp, ArrowDown, AlertCircle, Plus, Check } from 'lucide-react';
import { formatBytes } from '../utils/fileHelpers';
import { UploadedFileItem } from '../types/tools';

interface FileUploaderProps {
  files: UploadedFileItem[];
  onFilesChange: (files: UploadedFileItem[]) => void;
  acceptsMultiple?: boolean;
  acceptedFormats?: string[];
  maxFileSizeMb?: number;
  label?: string;
  sublabel?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChange,
  acceptsMultiple = false,
  acceptedFormats,
  maxFileSizeMb = 100,
  label = 'Choose a file or drag & drop here',
  sublabel,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedExtString = acceptedFormats
    ? acceptedFormats.join(', ')
    : 'All supported file formats';

  const validateAndAddFiles = (newFileList: FileList | File[]) => {
    setErrorMessage(null);
    const validItems: UploadedFileItem[] = [];
    const maxBytes = maxFileSizeMb * 1024 * 1024;

    for (let i = 0; i < newFileList.length; i++) {
      const file = newFileList[i];

      // Size check
      if (file.size > maxBytes) {
        setErrorMessage(`File "${file.name}" exceeds the maximum size limit of ${maxFileSizeMb} MB.`);
        return;
      }

      // Format check if specified
      if (acceptedFormats && acceptedFormats.length > 0) {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        const mime = file.type.toLowerCase();

        const match = acceptedFormats.some((fmt) => {
          const lower = fmt.toLowerCase();
          if (lower.startsWith('.')) {
            return ext === lower;
          }
          if (lower.endsWith('/*')) {
            const prefix = lower.replace('/*', '');
            return mime.startsWith(prefix);
          }
          return mime === lower;
        });

        if (!match) {
          setErrorMessage(
            `Unsupported format for "${file.name}". Supported formats: ${acceptedExtString}`
          );
          return;
        }
      }

      const item: UploadedFileItem = {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'Unknown type',
      };

      if (file.type.startsWith('image/')) {
        item.previewUrl = URL.createObjectURL(file);
      }

      validItems.push(item);
    }

    if (validItems.length === 0) return;

    if (acceptsMultiple) {
      onFilesChange([...files, ...validItems]);
    } else {
      // Single file mode replaces existing
      onFilesChange([validItems[0]]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    // reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-[#EF4444] bg-red-50/80 dark:bg-red-950/40 scale-[0.99] ring-4 ring-[#EF4444]/15'
            : 'border-gray-300 dark:border-gray-700 hover:border-[#EF4444]/50 bg-white dark:bg-[#16181d] hover:bg-gray-50/50 dark:hover:bg-[#1b1e25] hover:shadow-lg hover:shadow-red-500/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={acceptsMultiple}
          accept={acceptedFormats ? acceptedFormats.join(',') : undefined}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#EF4444] flex items-center justify-center mx-auto mb-4 shadow-xs group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:bg-[#EF4444] group-hover:text-white transition-all duration-200 group-hover:shadow-lg group-hover:shadow-red-500/25">
          <UploadCloud className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white group-hover:text-[#EF4444] transition-colors mb-1">
          {label}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
          {sublabel || (acceptsMultiple ? 'Select one or more files to get started' : 'Click to browse from your device')}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="btn-3d btn-sheen px-5 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-red-500/20 cursor-pointer"
        >
          Browse Files
        </button>

        <div className="mt-4 text-[11px] text-gray-400 dark:text-gray-500 flex flex-wrap items-center justify-center gap-2">
          <span>Supported: {acceptedExtString}</span>
          <span>·</span>
          <span>Max file size: {maxFileSizeMb} MB</span>
          <span>·</span>
          <span>Private local processing</span>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files List with reorder and delete options */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EEEEEE] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
              Selected {files.length === 1 ? 'File' : `Files (${files.length})`}
            </span>
            <div className="flex items-center gap-2">
              {acceptsMultiple && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#E53935] hover:text-[#C62828]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add more
                </button>
              )}
              {files.length > 1 && (
                <button
                  type="button"
                  onClick={() => onFilesChange([])}
                  className="text-xs text-[#888888] hover:text-red-600 ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FFFBFB] border border-[#F5E6E6] hover:border-[#E53935]/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-[#DDD]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#FFF0F0] text-[#E53935] flex items-center justify-center shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#171717] truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#777777]">
                      <span className="font-mono tabular-nums">{formatBytes(item.size)}</span>
                      {acceptsMultiple && <span>· Position {idx + 1}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  {acceptsMultiple && files.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-[#666666] hover:text-[#171717] disabled:opacity-30 rounded hover:bg-neutral-100"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="p-1.5 text-[#666666] hover:text-[#171717] disabled:opacity-30 rounded hover:bg-neutral-100"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 text-[#888888] hover:text-red-600 rounded hover:bg-red-50 transition-colors ml-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

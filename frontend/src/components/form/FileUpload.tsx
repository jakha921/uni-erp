import { useState, useRef, useCallback, type DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
  preview?: boolean;
  className?: string;
  error?: string;
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  onUpload,
  preview = true,
  className,
  error,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);
      const oversized = arr.find((f) => f.size > maxSize);
      if (oversized) {
        setLocalError(`Fayl hajmi ${(maxSize / 1024 / 1024).toFixed(0)} MB dan oshmasligi kerak`);
        return;
      }
      setLocalError(null);
      const next = multiple ? [...files, ...arr] : arr.slice(0, 1);
      setFiles(next);
      onUpload(next);
    },
    [files, maxSize, multiple, onUpload],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onUpload(next);
  };

  const displayError = error ?? localError;

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-border hover:border-primary-300 hover:bg-slate-50',
          displayError && 'border-error',
        )}
      >
        <Upload className={cn('h-8 w-8', dragOver ? 'text-primary-500' : 'text-muted')} />
        <div className="text-center">
          <p className="text-sm font-medium">Faylni tanlang yoki shu yerga tashlang</p>
          <p className="text-xs text-muted mt-1">
            Maks. hajm: {(maxSize / 1024 / 1024).toFixed(0)} MB
            {accept && ` (${accept})`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {displayError && <p className="text-xs text-error mt-1">{displayError}</p>}

      {preview && files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 text-sm">
              <FileText className="h-4 w-4 text-muted shrink-0" />
              <span className="truncate flex-1">{file.name}</span>
              <span className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => removeFile(i)} className="p-0.5 hover:bg-slate-200 rounded">
                <X className="h-3.5 w-3.5 text-muted" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

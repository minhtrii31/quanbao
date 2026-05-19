import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/api/upload';
import { getApiErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  imageUrl?: string;
  className?: string;
}

export function ImageUpload({ onImageUpload, imageUrl, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ file ảnh.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh quá lớn. Tối đa 5MB.');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadImage(file);
      setPreview(result.url);
      onImageUpload(result.url);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Tải ảnh thất bại'));
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearImage = useCallback(() => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageUpload]);

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors',
          uploading
            ? 'border-primary bg-primary/5'
            : isDragging
            ? 'border-primary bg-primary/5'
            : preview
            ? 'border-border bg-muted/30'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        {uploading ? (
          <p className="text-sm font-medium text-primary">Đang tải ảnh...</p>
        ) : preview ? (
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- Admin previews may use pasted URLs outside next/image remotePatterns. */}
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-48 object-contain rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Kéo thả ảnh vào đây
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              hoặc nhấn để chọn file
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, GIF, WebP • Tối đa 5MB
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

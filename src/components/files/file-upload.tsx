"use client";

import { useState, useCallback } from "react";
import { cn, formatFileSize } from "@/lib/utils";
import { Upload, X, FileIcon, Image as ImageIcon } from "lucide-react";
import { UploadProgress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress?: number;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  label?: string;
  description?: string;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  accept = "image/*,.stl,.3dm",
  multiple = true,
  label = "Upload Files",
  description = "Drag and drop files here, or click to browse",
  onFilesSelected,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadedFile[] = Array.from(fileList).map((file, i) => ({
        id: `upload-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      onFilesSelected?.(Array.from(fileList));

      newFiles.forEach((f) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setFiles((prev) =>
            prev.map((file) => (file.id === f.id ? { ...file, progress: Math.round(progress) } : file))
          );
        }, 200);
      });
    },
    [onFilesSelected]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative border-2 border-dashed rounded-[14px] p-8 text-center transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-gold bg-gold/5 scale-[1.01]"
            : "border-border hover:border-gold/50 hover:bg-muted/30"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-gold/10">
            <Upload className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <p className="text-xs text-muted-foreground">STL, 3DM, JPG, PNG supported</p>
        </div>
      </div>

      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {file.progress !== undefined && file.progress < 100 ? (
              <UploadProgress fileName={file.name} progress={file.progress} />
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-gold" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={() => removeFile(file.id)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ImageGalleryProps {
  images: { id: string; url: string; name: string }[];
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selected, setSelected] = useState(images[0]?.id);

  if (!images.length) {
    return (
      <div className={cn("flex items-center justify-center h-48 rounded-xl bg-muted/50 text-muted-foreground", className)}>
        <ImageIcon className="w-8 h-8 mr-2 opacity-50" />
        No images uploaded
      </div>
    );
  }

  const selectedImage = images.find((img) => img.id === selected) || images[0];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
        <img
          src={selectedImage.url}
          alt={selectedImage.name}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelected(img.id)}
              className={cn(
                "w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                selected === img.id ? "border-gold shadow-md" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

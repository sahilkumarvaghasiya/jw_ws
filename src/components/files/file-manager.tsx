"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatFileSize, formatDate } from "@/lib/utils";
import { Download, Search, FileIcon, Image as ImageIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileType } from "@/lib/types";

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  orderNumber?: string;
  version?: number;
}

interface FileManagerProps {
  files: FileItem[];
}

const typeFilters: { label: string; value: FileType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Reference", value: "reference" },
  { label: "STL", value: "stl" },
  { label: "3DM", value: "3dm" },
  { label: "Images", value: "jpg" },
];

const typeIcons: Record<string, React.ElementType> = {
  stl: FileIcon,
  "3dm": FileIcon,
  jpg: ImageIcon,
  png: ImageIcon,
  reference: ImageIcon,
};

export function FileManager({ files }: FileManagerProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FileType | "all">("all");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const filtered = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.orderNumber?.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || f.type === typeFilter ||
      (typeFilter === "jpg" && (f.type === "jpg" || f.type === "png"));
    return matchesSearch && matchesType;
  });

  const isImage = (type: string) => ["jpg", "png", "reference"].includes(type);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1",
                  typeFilter === f.value ? "bg-gold/10 text-gold-dark" : "bg-muted text-muted-foreground"
                )}
              >
                {f.label === "All" && <Filter className="w-3 h-3" />}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">File</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Size</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Uploaded</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">By</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((file) => {
                    const Icon = typeIcons[file.type] || FileIcon;
                    return (
                      <tr
                        key={file.id}
                        className={cn(
                          "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                          previewFile?.id === file.id && "bg-gold/5"
                        )}
                        onClick={() => setPreviewFile(file)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-gold" />
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                              {file.orderNumber && (
                                <p className="text-xs text-muted-foreground">{file.orderNumber}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="uppercase text-xs font-medium text-muted-foreground">{file.type}</span>
                          {file.version && <span className="text-xs text-gold ml-1">v{file.version}</span>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{formatFileSize(file.size)}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{formatDate(file.uploadedAt)}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{file.uploadedBy}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No files found</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewFile ? (
              <div className="space-y-4">
                {isImage(previewFile.type) ? (
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={previewFile.url} alt={previewFile.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-muted flex flex-col items-center justify-center">
                    <FileIcon className="w-12 h-12 text-gold mb-2" />
                    <p className="text-sm font-medium">{previewFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatFileSize(previewFile.size)}</p>
                  </div>
                )}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="uppercase font-medium">{previewFile.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded</span>
                    <span>{formatDate(previewFile.uploadedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">By</span>
                    <span>{previewFile.uploadedBy}</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Select a file to preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

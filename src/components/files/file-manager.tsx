"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { formatFileSize, formatDate, formatDateTime, cn } from "@/lib/utils";
import {
  Download,
  Search,
  FileIcon,
  Image as ImageIcon,
  Factory,
  Palette,
  ChevronDown,
  Plus,
  Send,
  AlertCircle,
  X,
  SlidersHorizontal,
  CheckCircle2,
  RotateCcw,
  Box,
  Eye,
} from "lucide-react";
import type { ManagedFile } from "@/lib/types";
import { designers, manufacturers } from "@/lib/mock-data";
import { useApp } from "@/context/app-context";
import { useFileRepairs } from "@/context/file-repair-context";
import { useFileForwards } from "@/context/file-forward-context";

interface FileManagerProps {
  files: ManagedFile[];
}

type TeamFilterMode = "designer" | "manufacturer" | "seller";
type FileTypeFilter = "stl" | "3dm" | "images";
type ReviewAction = "repair" | "forward";

const typeFilters: { label: string; value: FileTypeFilter | "all" }[] = [
  { label: "All types", value: "all" },
  { label: "STL", value: "stl" },
  { label: "3DM", value: "3dm" },
  { label: "Images", value: "images" },
];

function fileMatchesTypeFilter(file: ManagedFile, selectedTypes: FileTypeFilter[]): boolean {
  if (file.type === "reference") return false;
  if (selectedTypes.length === 0) return true;
  return selectedTypes.some((type) => {
    if (type === "stl") return file.type === "stl";
    if (type === "3dm") return file.type === "3dm";
    return file.type === "jpg" || file.type === "png";
  });
}

function FileStatusBadge({ file, getRepairsForFile, getForwardForFile, hideManufacturer }: {
  file: ManagedFile;
  getRepairsForFile: (id: string) => { status: string }[];
  getForwardForFile: (id: string) => { manufacturerName: string } | undefined;
  hideManufacturer?: boolean;
}) {
  const repair = getRepairsForFile(file.id).some((r) => r.status === "pending");
  const forward = getForwardForFile(file.id);

  if (repair) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400">
        <RotateCcw className="w-3 h-3" />
        In repair
      </span>
    );
  }
  if (forward && !hideManufacturer) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
        <Factory className="w-3 h-3" />
        With {forward.manufacturerName.split(" ")[0]}
      </span>
    );
  }
  if (file.uploadedByRole === "designer") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gold/10 text-gold-dark">
        {hideManufacturer ? "Sent to seller" : "Ready to review"}
      </span>
    );
  }
  if (hideManufacturer && file.uploadedByRole === "seller") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
        From seller
      </span>
    );
  }
  return null;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        active
          ? "bg-gold text-white shadow-sm"
          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
      )}
    >
      {children}
    </button>
  );
}

function PersonFilter({
  mode,
  options,
  selectedIds,
  onChange,
}: {
  mode: TeamFilterMode;
  options: { id: string; name: string; email: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 224 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 224),
    });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(
    (o) =>
      !query.trim() ||
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.email.toLowerCase().includes(query.toLowerCase())
  );

  const label =
    mode === "designer" ? "Designer" : mode === "manufacturer" ? "Manufacturer" : "Seller";

  const menu = open ? (
    <div
      ref={menuRef}
      className="fixed z-[200] rounded-xl border border-border bg-card shadow-lg p-2"
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
      }}
    >
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="search"
          placeholder={`Search ${label.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-0.5">
        {filtered.map((o) => (
          <label
            key={o.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(o.id)}
              onChange={() =>
                onChange(
                  selectedIds.includes(o.id)
                    ? selectedIds.filter((id) => id !== o.id)
                    : [...selectedIds, o.id]
                )
              }
              className="rounded text-gold focus:ring-gold"
            />
            <span className="truncate">{o.name}</span>
          </label>
        ))}
      </div>
      {selectedIds.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground py-1"
        >
          Clear
        </button>
      )}
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setQuery("");
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        {selectedIds.length > 0 && (
          <span className="bg-gold/20 text-gold-dark px-1.5 rounded-full">{selectedIds.length}</span>
        )}
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}

export function FileManager({ files }: FileManagerProps) {
  const { role, user } = useApp();
  const { addRepairRequest, getRepairsForFile } = useFileRepairs();
  const { forwardFiles, getForwardForFile } = useFileForwards();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<FileTypeFilter[]>([]);
  const [teamFilterMode, setTeamFilterMode] = useState<TeamFilterMode>("designer");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<ReviewAction>("forward");
  const [forwardManufacturerId, setForwardManufacturerId] = useState("");
  const [forwardMessage, setForwardMessage] = useState("");
  const [forwardPreferredDate, setForwardPreferredDate] = useState("");
  const [repairNotes, setRepairNotes] = useState<string[]>([""]);
  const [actionFeedback, setActionFeedback] = useState<"repair" | "forward" | null>(null);
  const [viewFileId, setViewFileId] = useState<string | null>(null);

  const isDesignerRole = role === "designer";
  const isManufacturerRole = role === "manufacturer";
  const isSellerOnlyTeamFilter = isDesignerRole || isManufacturerRole;
  const teamOptions = teamFilterMode === "designer" ? designers : manufacturers;

  const sellerOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; email: string }>();
    files.forEach((f) => {
      if (f.sellerId && f.sellerName) {
        map.set(f.sellerId, { id: f.sellerId, name: f.sellerName, email: "" });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [files]);

  const toggleTypeFilter = (value: FileTypeFilter | "all") => {
    if (value === "all") {
      setSelectedTypes([]);
      return;
    }
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const filtered = files.filter((file) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      file.name.toLowerCase().includes(query) ||
      file.orderNumber.toLowerCase().includes(query) ||
      file.productTitle.toLowerCase().includes(query);
    const matchesType = fileMatchesTypeFilter(file, selectedTypes);
    const matchesTeam = isSellerOnlyTeamFilter
      ? selectedSellerIds.length === 0 ||
        (file.sellerId && selectedSellerIds.includes(file.sellerId))
      : selectedTeamIds.length === 0 ||
        (teamFilterMode === "designer"
          ? file.designerId && selectedTeamIds.includes(file.designerId)
          : file.manufacturerId && selectedTeamIds.includes(file.manufacturerId));
    return matchesSearch && matchesType && matchesTeam;
  });

  const isImage = (type: string) => ["jpg", "png", "reference"].includes(type);
  const isDesignerFile = (file: ManagedFile) => role === "seller" && file.uploadedByRole === "designer";
  const canSelectFile = (file: ManagedFile) =>
    isDesignerFile(file) &&
    !getForwardForFile(file.id) &&
    !getRepairsForFile(file.id).some((r) => r.status === "pending");

  const selectableFiles = filtered.filter(canSelectFile);
  const selectedFiles = filtered.filter((f) => selectedFileIds.includes(f.id) && canSelectFile(f));
  const viewFile = viewFileId ? filtered.find((f) => f.id === viewFileId) ?? files.find((f) => f.id === viewFileId) : null;

  const allSelectableSelected =
    selectableFiles.length > 0 && selectableFiles.every((f) => selectedFileIds.includes(f.id));

  const activeFilterCount = isSellerOnlyTeamFilter
    ? selectedTypes.length + selectedSellerIds.length
    : selectedTypes.length + selectedTeamIds.length + (teamFilterMode !== "designer" ? 1 : 0);

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
    setActionFeedback(null);
  };

  const toggleSelectAll = () => {
    if (allSelectableSelected) {
      setSelectedFileIds((prev) => prev.filter((id) => !selectableFiles.some((f) => f.id === id)));
    } else {
      setSelectedFileIds((prev) => [...new Set([...prev, ...selectableFiles.map((f) => f.id)])]);
    }
    setActionFeedback(null);
  };

  const handleForwardFiles = (filesToForward: ManagedFile[]) => {
    const manufacturer = manufacturers.find((m) => m.id === forwardManufacturerId);
    if (!manufacturer || filesToForward.length === 0) return;
    forwardFiles({
      files: filesToForward,
      manufacturerId: manufacturer.id,
      manufacturerName: manufacturer.name,
      sellerName: user.name,
      note: forwardMessage.trim() || undefined,
      sellerPreferredDate: forwardPreferredDate || undefined,
    });
    setSelectedFileIds((prev) => prev.filter((id) => !filesToForward.some((f) => f.id === id)));
    setActionFeedback("forward");
    setForwardMessage("");
    setForwardPreferredDate("");
  };

  const handleSendForRepair = (filesToRepair: ManagedFile[]) => {
    const notes = repairNotes.map((n) => n.trim()).filter(Boolean);
    if (notes.length === 0 || filesToRepair.length === 0) return;
    filesToRepair.forEach((file) => {
      addRepairRequest({
        fileId: file.id,
        orderId: file.orderId,
        orderNumber: file.orderNumber,
        fileName: file.name,
        productTitle: file.productTitle,
        notes,
        sellerName: user.name,
      });
    });
    setSelectedFileIds((prev) => prev.filter((id) => !filesToRepair.some((f) => f.id === id)));
    setActionFeedback("repair");
    setRepairNotes([""]);
  };

  const renderFilePreview = (file: ManagedFile, compact = false) => (
    <div className={cn("space-y-4", compact ? "p-4" : "p-4")}>
      <div
        className={cn(
          "rounded-xl overflow-hidden bg-muted flex items-center justify-center",
          compact ? "aspect-[4/3]" : "aspect-video"
        )}
      >
        {isImage(file.type) && file.url !== "#" ? (
          <img src={file.url} alt={file.name} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center p-6">
            <Box className="w-10 h-10 text-gold mx-auto mb-2" />
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {file.type.toUpperCase()} · {formatFileSize(file.size)}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-medium text-sm">{file.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">{file.productTitle}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Order</dt>
          <dd className="font-medium mt-0.5">{file.orderNumber}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Uploaded</dt>
          <dd className="font-medium mt-0.5">{formatDate(file.uploadedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">By</dt>
          <dd className="font-medium mt-0.5 capitalize">{file.uploadedBy}</dd>
        </div>
        {file.designerName && (
          <div>
            <dt className="text-muted-foreground">Designer</dt>
            <dd className="font-medium mt-0.5">{file.designerName}</dd>
          </div>
        )}
      </dl>

      {file.designerNote && file.uploadedByRole === "designer" && (
        <div className="p-3 rounded-xl bg-gold/5 border border-gold/20 text-xs">
          <p className="font-medium text-gold-dark dark:text-gold mb-1">Designer note</p>
          <p className="text-muted-foreground">{file.designerNote}</p>
        </div>
      )}

      {getRepairsForFile(file.id).find((r) => r.status === "pending") && !isSellerOnlyTeamFilter && (
        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs space-y-1">
          <p className="font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Awaiting designer repair
          </p>
          {getRepairsForFile(file.id)
            .find((r) => r.status === "pending")
            ?.notes.map((n, i) => (
              <p key={i} className="text-muted-foreground pl-5">{n}</p>
            ))}
        </div>
      )}

      {getForwardForFile(file.id) && !isSellerOnlyTeamFilter && (
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-1">
          <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Factory className="w-3.5 h-3.5" />
            With {getForwardForFile(file.id)?.manufacturerName}
          </p>
          {getForwardForFile(file.id)?.note && (
            <p className="text-muted-foreground pl-5">{getForwardForFile(file.id)?.note}</p>
          )}
          <p className="text-muted-foreground pl-5">
            {formatDateTime(getForwardForFile(file.id)!.createdAt)}
          </p>
        </div>
      )}

      <Button className="w-full" variant="outline">
        <Download className="w-4 h-4" />
        Download
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="overflow-visible shadow-[var(--shadow-sm)]">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search order ID or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:bg-background transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
                className={cn(showFilters && "border-gold/40 bg-gold/5")}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {filtered.length} file{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {showFilters && (
            <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2 overflow-visible">
              {typeFilters.map((f) => (
                <FilterChip
                  key={f.value}
                  active={f.value === "all" ? selectedTypes.length === 0 : selectedTypes.includes(f.value)}
                  onClick={() => toggleTypeFilter(f.value)}
                >
                  {f.label}
                </FilterChip>
              ))}
              <span className="w-px h-4 bg-border mx-1 hidden sm:block" />
              {isSellerOnlyTeamFilter ? (
                <PersonFilter
                  mode="seller"
                  options={sellerOptions}
                  selectedIds={selectedSellerIds}
                  onChange={setSelectedSellerIds}
                />
              ) : (
                <>
                  <div className="flex rounded-full border border-border p-0.5 bg-muted/40">
                    <button
                      type="button"
                      onClick={() => { setTeamFilterMode("designer"); setSelectedTeamIds([]); }}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                        teamFilterMode === "designer" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Palette className="w-3 h-3" />
                      Designer
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTeamFilterMode("manufacturer"); setSelectedTeamIds([]); }}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                        teamFilterMode === "manufacturer" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Factory className="w-3 h-3" />
                      Manufacturer
                    </button>
                  </div>
                  <PersonFilter
                    key={teamFilterMode}
                    mode={teamFilterMode}
                    options={teamOptions}
                    selectedIds={selectedTeamIds}
                    onChange={setSelectedTeamIds}
                  />
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {actionFeedback && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 text-success text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {actionFeedback === "repair"
            ? "Repair request sent to the designer."
            : "Files forwarded to the manufacturer."}
          <button type="button" onClick={() => setActionFeedback(null)} className="ml-auto hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* File list */}
        <div className="lg:col-span-3 space-y-3">
          {role === "seller" && selectableFiles.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelectableSelected}
                  onChange={toggleSelectAll}
                  className="rounded text-gold focus:ring-gold"
                />
                Select all reviewable
              </label>
              {selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFileIds([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear ({selectedFiles.length})
                </button>
              )}
            </div>
          )}

          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground text-sm">
              No files match your search or filters.
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((file) => {
                const selected = selectedFileIds.includes(file.id);
                const viewing = viewFileId === file.id;
                const selectable = canSelectFile(file);
                const Icon = isImage(file.type) ? ImageIcon : FileIcon;

                return (
                  <div
                    key={file.id}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-xl border transition-all bg-card",
                      viewing && "ring-2 ring-gold/30 border-gold/40 bg-gold/5",
                      !viewing && selected && "border-gold/40 bg-gold/5 shadow-[var(--shadow-sm)]",
                      !viewing && !selected && "border-border hover:border-gold/25 hover:shadow-[var(--shadow-sm)]"
                    )}
                  >
                    {role === "seller" && (
                      <div
                        className="shrink-0"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        {selectable ? (
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleFileSelection(file.id)}
                            className="rounded text-gold focus:ring-gold w-4 h-4"
                            aria-label={`Select ${file.name}`}
                          />
                        ) : (
                          <div className="w-4" />
                        )}
                      </div>
                    )}

                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                      {isImage(file.type) && file.url !== "#" ? (
                        <img src={file.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-5 h-5 text-gold" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <FileStatusBadge
                          file={file}
                          getRepairsForFile={getRepairsForFile}
                          getForwardForFile={getForwardForFile}
                          hideManufacturer={isSellerOnlyTeamFilter}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {file.orderNumber} · {file.productTitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                        {file.type.toUpperCase()}
                        {file.version ? ` · v${file.version}` : ""}
                        {" · "}
                        {formatFileSize(file.size)}
                        {" · "}
                        {file.uploadedBy}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(viewing && "text-gold bg-gold/10")}
                        onClick={() => setViewFileId(file.id)}
                        aria-label={`View ${file.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={`Download ${file.name}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24 shadow-[var(--shadow-sm)] overflow-y-auto max-h-[calc(100vh-7rem)]">
            {role === "seller" && selectedFiles.length > 0 && (
              <div className="border-b border-border">
                <div className="px-4 pt-4 pb-3 bg-muted/30">
                  <p className="text-sm font-medium">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {selectedFiles.map((f) => f.name).join(", ")}
                  </p>
                  <div className="flex mt-3 p-0.5 rounded-lg bg-muted/60 border border-border">
                    <button
                      type="button"
                      onClick={() => setActiveAction("repair")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all",
                        activeAction === "repair"
                          ? "bg-background shadow-sm text-orange-600 dark:text-orange-400"
                          : "text-muted-foreground"
                      )}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Send for repair
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAction("forward")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all",
                        activeAction === "forward"
                          ? "bg-background shadow-sm text-gold-dark"
                          : "text-muted-foreground"
                      )}
                    >
                      <Factory className="w-3.5 h-3.5" />
                      Forward
                    </button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4">
                  {activeAction === "repair" ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Tell the designer what needs to be fixed. They&apos;ll see this on their dashboard.
                      </p>
                      {repairNotes.map((note, i) => (
                        <div key={i} className="flex gap-2">
                          <Textarea
                            rows={2}
                            placeholder={i === 0 ? "Your message..." : "Additional note..."}
                            value={note}
                            onChange={(e) =>
                              setRepairNotes((prev) =>
                                prev.map((n, idx) => (idx === i ? e.target.value : n))
                              )
                            }
                          />
                          {repairNotes.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setRepairNotes((prev) => prev.filter((_, idx) => idx !== i))
                              }
                              className="self-end p-2 text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setRepairNotes((prev) => [...prev, ""])}
                        className="text-xs text-gold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add another note
                      </button>
                      <Button
                        type="button"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={!repairNotes.some((n) => n.trim())}
                        onClick={() => handleSendForRepair(selectedFiles)}
                      >
                        <Send className="w-4 h-4" />
                        Send for repair
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Approve and send to a manufacturer for production.
                      </p>
                      <div className="space-y-2">
                        {manufacturers.map((m) => (
                          <label
                            key={m.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                              forwardManufacturerId === m.id
                                ? "border-gold bg-gold/5"
                                : "border-border hover:border-gold/30"
                            )}
                          >
                            <input
                              type="radio"
                              name="mfr"
                              checked={forwardManufacturerId === m.id}
                              onChange={() => setForwardManufacturerId(m.id)}
                              className="text-gold focus:ring-gold"
                            />
                            <div>
                              <p className="text-sm font-medium">{m.name}</p>
                              <p className="text-xs text-muted-foreground">{m.email}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      <Textarea
                        rows={3}
                        label="Message"
                        placeholder="Production instructions or request an earlier finish date..."
                        value={forwardMessage}
                        onChange={(e) => setForwardMessage(e.target.value)}
                      />
                      <Input
                        type="date"
                        label="Requested finish date (optional)"
                        value={forwardPreferredDate}
                        onChange={(e) => setForwardPreferredDate(e.target.value)}
                      />
                      <Button
                        type="button"
                        className="w-full"
                        disabled={!forwardManufacturerId}
                        onClick={() => handleForwardFiles(selectedFiles)}
                      >
                        <Send className="w-4 h-4" />
                        Forward to manufacturer
                      </Button>
                    </>
                  )}
                </CardContent>
              </div>
            )}

            {viewFile ? (
              <div className={selectedFiles.length > 0 ? "border-t border-border" : ""}>
                {selectedFiles.length > 0 && (
                  <p className="px-4 pt-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    File preview
                  </p>
                )}
                {renderFilePreview(viewFile, selectedFiles.length > 0)}
                {role === "seller" && canSelectFile(viewFile) && selectedFiles.length === 0 && (
                  <p className="text-xs text-center text-muted-foreground px-4 pb-4">
                    Check the box to include this file in a repair or forward action.
                  </p>
                )}
              </div>
            ) : selectedFiles.length > 0 ? (
              <div className="p-6 text-center border-t border-border">
                <Eye className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click the <Eye className="w-3.5 h-3.5 inline-block align-text-bottom" /> icon on any file to preview it here while you work.
                </p>
              </div>
            ) : (
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto">
                  <FileIcon className="w-6 h-6 text-gold" />
                </div>
                {role === "seller" ? (
                  <div>
                    <p className="font-medium text-sm">Review designer files</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      1. Click <Eye className="w-3.5 h-3.5 inline-block align-text-bottom" /> to preview a file<br />
                      2. Check files that need action<br />
                      3. Repair or forward from the panel above
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Click the eye icon to view a file</p>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

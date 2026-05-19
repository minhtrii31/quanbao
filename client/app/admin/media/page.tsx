"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CmsImage } from "@/components/public/cms-image";
import { MediaItem } from "@/types/api";
import { deleteMedia, getMedia, updateMedia, uploadMedia } from "@/lib/api/media";
import { isRequestCanceled } from "@/lib/api";
import { AdminPageHeader, ConfirmDialog, EmptyState, PageLoading, StatusBadge } from "@/components/admin";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [query, setQuery] = useState("");
  const [altFilter, setAltFilter] = useState<"all" | "missing" | "has">("all");
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>({});
  const [altSaving, setAltSaving] = useState<Record<string, "idle" | "saving" | "saved" | "error">>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebouncedValue(query, 350);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    getMedia({ page, limit: 12, search: debouncedQuery }, { signal: controller.signal })
      .then((data) => {
        if (requestIdRef.current !== requestId) return;
        setItems(data.media);
        setAltDrafts((current) => ({
          ...current,
          ...Object.fromEntries(data.media.map((item) => [item._id, item.alt || ""])),
        }));
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .catch((loadError) => {
        if (!isRequestCanceled(loadError) && requestIdRef.current === requestId) {
          toast.error("Không tải được media");
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });

    return () => controller.abort();
  }, [page, debouncedQuery]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ hỗ trợ upload file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    try {
      setUploading(true);
      await uploadMedia(file);
      toast.success("Đã upload ảnh");
      setPage(1);
      const data = await getMedia({ page: 1, limit: 12, search: debouncedQuery });
      setItems(data.media);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const visibleItems = items.filter((item) => {
    if (altFilter === "missing") return !item.alt;
    if (altFilter === "has") return Boolean(item.alt);
    return true;
  });
  const altFilterLabel = altFilter === "missing" ? "thiếu alt" : "có alt";

  const handleAltChange = async (item: MediaItem) => {
    const alt = altDrafts[item._id] ?? "";
    if (alt === (item.alt || "")) return;
    try {
      setAltSaving((current) => ({ ...current, [item._id]: "saving" }));
      const updated = await updateMedia(item._id, alt);
      setItems((current) => current.map((media) => (media._id === updated._id ? updated : media)));
      setAltSaving((current) => ({ ...current, [item._id]: "saved" }));
      toast.success("Đã lưu alt");
    } catch {
      setAltSaving((current) => ({ ...current, [item._id]: "error" }));
      toast.error("Không lưu được alt");
    }
  };

  const handleDelete = async (item: MediaItem) => {
    try {
      setDeletingId(item._id);
      await deleteMedia(item._id);
      setConfirmDelete(null);
      toast.success("Đã xóa ảnh");
      const data = await getMedia({ page, limit: 12, search: debouncedQuery });
      setItems(data.media);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Xóa ảnh thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="px-4 py-6 pt-20 lg:px-6 lg:pt-8">
        <AdminPageHeader
          title="Media"
          description="Upload, copy URL, sửa alt và xóa ảnh"
          action={
            <Button className="rounded-none" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Upload ảnh">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Đang upload..." : "Upload"}
            </Button>
          }
        />
        <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,320px)_180px]">
          <div className="space-y-1.5">
            <Label htmlFor="media-search">Tìm kiếm</Label>
            <Input
              id="media-search"
              className="rounded-none"
              placeholder="Alt, folder, public ID..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="media-alt-filter">Alt text</Label>
            <select
              id="media-alt-filter"
              className="h-9 w-full rounded-none border border-input bg-transparent px-2.5 text-sm"
              value={altFilter}
              onChange={(event) => setAltFilter(event.target.value as "all" | "missing" | "has")}
            >
              <option value="all">Tất cả</option>
              <option value="missing">Thiếu alt</option>
              <option value="has">Có alt</option>
            </select>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />
        </div>

        {loading && items.length > 0 && (
          <p className="mb-3 text-sm text-muted-foreground">Đang cập nhật media...</p>
        )}

        {loading && items.length === 0 ? (
          <PageLoading />
        ) : visibleItems.length === 0 ? (
          <EmptyState title="Chưa có media phù hợp" description="Thử đổi từ khóa tìm kiếm hoặc bộ lọc alt text." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((item) => (
              <div key={item._id} className="border border-border bg-card">
                <button
                  type="button"
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={() => setPreview(item)}
                  aria-label={`Xem ảnh ${item.alt || item.publicId || item._id}`}
                >
                  <CmsImage src={item.url} alt={item.alt || "Media"} className="object-cover" />
                  {!item.alt && <StatusBadge status="missingAlt" className="absolute left-2 top-2" />}
                </button>
                <div className="space-y-3 p-3">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="truncate">{item.folder}</p>
                    <p>{item.mimeType} - {formatFileSize(item.size)}</p>
                    <StatusBadge status={item.alt ? "hasAlt" : "missingAlt"} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`alt-${item._id}`}>Alt text</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`alt-${item._id}`}
                        value={altDrafts[item._id] ?? ""}
                        placeholder="Mô tả ảnh"
                        onChange={(e) => {
                          setAltDrafts((current) => ({ ...current, [item._id]: e.target.value }));
                          setAltSaving((current) => ({ ...current, [item._id]: "idle" }));
                        }}
                      />
                      <Button
                        variant="outline"
                        className="rounded-none"
                        onClick={() => handleAltChange(item)}
                        disabled={altSaving[item._id] === "saving" || (altDrafts[item._id] ?? "") === (item.alt || "")}
                      >
                        {altSaving[item._id] === "saving" ? "Đang lưu..." : "Lưu"}
                      </Button>
                    </div>
                    {altSaving[item._id] === "saved" && <p className="text-xs text-emerald-700">Đã lưu</p>}
                    {altSaving[item._id] === "error" && <p className="text-xs text-destructive">Lỗi khi lưu</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-none"
                      aria-label="Copy URL ảnh"
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.url);
                        toast.success("Đã copy URL ảnh");
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-none"
                      onClick={() => setConfirmDelete(item)}
                      disabled={deletingId === item._id}
                      aria-label="Xóa ảnh"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-muted-foreground">
          {altFilter === "all" ? (
            <span className="min-w-0 flex-1">
              Hiển thị {total > 0 ? `${(page - 1) * 12 + 1}-${Math.min(page * 12, total)}` : "0-0"} của {total}
            </span>
          ) : (
            <span className="min-w-0 flex-1">
              Hiển thị {visibleItems.length} media {altFilterLabel} trên trang này; phân trang theo {total} kết quả tìm kiếm
            </span>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || loading}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{page}/{totalPages}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages || loading}
              aria-label="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPreview(null);
        }}>
          <div className="w-full max-w-4xl border border-border bg-background p-3">
            <div className="relative aspect-video bg-muted">
              <CmsImage src={preview.url} alt={preview.alt || "Media preview"} className="object-contain" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="truncate text-sm text-muted-foreground">{preview.alt || preview.publicId}</p>
              <Button variant="outline" className="rounded-none" onClick={() => setPreview(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Xác nhận xóa"
        description="Xóa ảnh này khỏi Cloudinary và CMS? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa ảnh"
        loading={deletingId !== null}
        onConfirm={() => {
          if (confirmDelete) return handleDelete(confirmDelete);
        }}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      />
    </div>
  );
}

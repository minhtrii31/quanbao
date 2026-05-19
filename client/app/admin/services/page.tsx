"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CmsImage } from "@/components/public/cms-image";
import { MediaItem, Service } from "@/types/api";
import { getApiErrorMessage, isRequestCanceled } from "@/lib/api";
import { getMedia } from "@/lib/api/media";
import { createService, deleteService, getAllServices, updateService } from "@/lib/api/services";
import { cn } from "@/lib/utils";
import { AdminPageHeader, ConfirmDialog, DirtyFormProtectionDialog, EmptyState, PageError, PageLoading, StatusBadge } from "@/components/admin";
import { useDirtyFormProtection } from "@/hooks/use-dirty-form-protection";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

type ServiceDraft = Partial<Service>;

type FieldErrors = {
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  order?: string;
};

const emptyService: ServiceDraft = {
  title: "",
  slug: "",
  description: "",
  detail: "",
  image: "",
  status: "published",
  order: 0,
  features: [],
  includes: [],
  process: [],
  seo: {},
};

const cloneEmptyService = () => ({
  ...emptyService,
  features: [],
  includes: [],
  process: [],
  seo: {},
});

const normalizeList = (items?: string[]) => (items || []).map((item) => item.trim()).filter(Boolean);

const normalizeDraft = (draft: ServiceDraft): ServiceDraft => ({
  ...draft,
  title: draft.title?.trim() || "",
  slug: draft.slug?.trim() || "",
  description: draft.description?.trim() || "",
  detail: draft.detail || "",
  image: draft.image?.trim() || "",
  status: draft.status || "published",
  order: Number(draft.order || 0),
  features: normalizeList(draft.features),
  includes: normalizeList(draft.includes),
  process: normalizeList(draft.process),
  seo: {
    title: draft.seo?.title?.trim() || "",
    description: draft.seo?.description?.trim() || "",
    ogImage: draft.seo?.ogImage?.trim() || "",
  },
});

const serviceBaseline = (service?: Service | null) => normalizeDraft(service ? { ...service } : cloneEmptyService());

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getVietnameseApiError = (error: unknown) => {
  const message = getApiErrorMessage(error, "Lưu dịch vụ thất bại");
  if (message.toLowerCase().includes("slug") && message.toLowerCase().includes("exists")) {
    return "Slug này đã được dùng. Hãy chọn slug khác.";
  }
  if (message.includes("title is required")) return "Nhập tiêu đề dịch vụ";
  if (message.includes("description is required")) return "Nhập mô tả ngắn";
  if (message.includes("image is required")) return "Chọn hoặc nhập URL ảnh";
  return message;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [draft, setDraft] = useState<ServiceDraft>(cloneEmptyService());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Service["status"]>("all");
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const selected = useMemo(
    () => services.find((service) => service._id === selectedId),
    [services, selectedId],
  );

  const isDirty = useMemo(() => {
    return JSON.stringify(normalizeDraft(draft)) !== JSON.stringify(serviceBaseline(selected));
  }, [draft, selected]);
  const dirtyForm = useDirtyFormProtection(isDirty);

  const filteredServices = useMemo(() => {
    const query = sidebarSearch.trim().toLowerCase();
    return services.filter((service) => {
      const matchesStatus = statusFilter === "all" || service.status === statusFilter;
      const matchesQuery = !query || [service.title, service.slug, service.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [services, sidebarSearch, statusFilter]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setLoadError("");
      setServices(await getAllServices());
    } catch (error) {
      setLoadError(getApiErrorMessage(error, "Không tải được danh sách dịch vụ"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    setDraft(selected ? { ...selected } : cloneEmptyService());
    setSlugEdited(Boolean(selected?.slug));
    setErrors({});
  }, [selected]);

  const updateField = <K extends keyof Service>(key: K, value: Service[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const updateTitle = (title: string) => {
    setDraft((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : slugify(title),
    }));
    setErrors((current) => ({ ...current, title: undefined, slug: undefined }));
  };

  const updateSlug = (slug: string) => {
    setSlugEdited(true);
    setDraft((current) => ({ ...current, slug: slugify(slug) }));
    setErrors((current) => ({ ...current, slug: undefined }));
  };

  const updateSeo = (key: keyof NonNullable<Service["seo"]>, value: string) => {
    setDraft((current) => ({ ...current, seo: { ...current.seo, [key]: value } }));
  };

  const validateDraft = () => {
    const nextErrors: FieldErrors = {
      title: draft.title?.trim() ? undefined : "Nhập tiêu đề dịch vụ",
      slug: draft.slug?.trim() ? undefined : "Nhập slug dịch vụ",
      description: draft.description?.trim() ? undefined : "Nhập mô tả ngắn",
      image: draft.image?.trim() ? undefined : "Chọn ảnh từ Media hoặc nhập URL ảnh",
      order: Number.isFinite(Number(draft.order)) ? undefined : "Thứ tự phải là số hợp lệ",
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSave = async () => {
    if (!validateDraft()) return;

    try {
      setSaving(true);
      const payload = normalizeDraft(draft);
      const saved = selected?._id
        ? await updateService(selected._id, payload)
        : await createService(payload);

      setServices((current) => {
        const exists = current.some((service) => service._id === saved._id);
        const next = exists
          ? current.map((service) => (service._id === saved._id ? saved : service))
          : [saved, ...current];
        return next.sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
      });
      setSelectedId(saved._id || "new");
      setDraft({ ...saved });
      setSlugEdited(Boolean(saved.slug));
      setErrors({});
      toast.success("Đã lưu dịch vụ");
    } catch (error) {
      const message = getVietnameseApiError(error);
      if (message.toLowerCase().includes("slug")) {
        setErrors((current) => ({ ...current, slug: message }));
      }
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!service._id) return;
    try {
      setDeleting(true);
      await deleteService(service._id);
      setServices((current) => current.filter((item) => item._id !== service._id));
      setSelectedId("new");
      setConfirmDelete(null);
      toast.success("Đã xóa dịch vụ");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Xóa dịch vụ thất bại"));
    } finally {
      setDeleting(false);
    }
  };

  const editorTitle = selected ? `Chỉnh sửa: ${selected.title}` : "Tạo dịch vụ mới";

  return (
    <div className="min-h-svh bg-background">
      <div className="grid gap-6 px-4 py-6 pt-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-6 lg:pt-8">
        <aside className="min-w-0 border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <AdminPageHeader
                title="Dịch vụ"
                description="Quản lý dịch vụ hiển thị tại trang /prices"
                className="mb-0"
              />
              <Button
                size="icon"
                className="shrink-0 rounded-none"
                onClick={() => dirtyForm.requestNavigation(() => setSelectedId("new"))}
                aria-label="Tạo dịch vụ mới"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="rounded-none pl-9"
                  placeholder="Tìm theo tên, slug..."
                  value={sidebarSearch}
                  onChange={(event) => setSidebarSearch(event.target.value)}
                  aria-label="Tìm dịch vụ"
                />
              </div>
              <select
                className="h-9 w-full rounded-none border border-input bg-background px-2.5 text-sm"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | Service["status"])}
                aria-label="Lọc trạng thái"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã đăng</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          <div className="max-h-[calc(100svh-252px)] overflow-y-auto">
            {loading ? (
              <PageLoading className="border-0" />
            ) : loadError ? (
              <PageError message={loadError} onRetry={loadServices} className="border-0" />
            ) : services.length === 0 ? (
              <EmptyState title="Chưa có dịch vụ" className="border-0" />
            ) : filteredServices.length === 0 ? (
              <EmptyState title="Không tìm thấy dịch vụ" description="Thử đổi từ khóa hoặc bộ lọc trạng thái." className="border-0" />
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service._id}
                  className={cn(
                    "flex items-stretch border-b border-border hover:bg-muted/50",
                    selectedId === service._id && "bg-muted",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => dirtyForm.requestNavigation(() => setSelectedId(service._id || "new"))}
                    className="flex min-w-0 flex-1 gap-3 p-3 text-left"
                  >
                    <div className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden bg-muted">
                      {service.image ? (
                        <CmsImage src={service.image} alt={service.title} className="object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium">{service.title || "Chưa đặt tên"}</p>
                      <p className="truncate text-xs text-muted-foreground">/{service.slug || "chua-co-slug"}</p>
                      <StatusBadge status={service.status} />
                    </div>
                  </button>
                  {service.status === "published" && service.slug && (
                    <Button asChild variant="ghost" size="icon" className="m-2 shrink-0 rounded-none" title="Xem ngoài website" aria-label="Xem ngoài website">
                      <Link href={`/prices/${service.slug}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="min-w-0">
          <div className="sticky top-0 z-20 border border-border bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/85">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{editorTitle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isDirty ? "Có thay đổi chưa lưu" : "Biểu mẫu đang đồng bộ với dữ liệu đã lưu"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected?.status === "published" && selected.slug && (
                  <Button asChild variant="outline" className="rounded-none">
                    <Link href={`/prices/${selected.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Xem ngoài website
                    </Link>
                  </Button>
                )}
                {selected && (
                  <Button
                    variant="destructive"
                    className="rounded-none"
                    onClick={() => dirtyForm.requestNavigation(() => setConfirmDelete(selected))}
                    disabled={deleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting ? "Đang xóa..." : "Xóa"}
                  </Button>
                )}
                <Button className="rounded-none" onClick={handleSave} disabled={saving || !isDirty}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {saving ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-5 border-x border-b border-border bg-card p-4">
            <ServiceEditorSection title="Thông tin chính">
              <div className="grid gap-4 lg:grid-cols-2">
                <FieldGroup label="Tiêu đề" htmlFor="service-title" required error={errors.title}>
                  <Input
                    id="service-title"
                    className="rounded-none"
                    value={draft.title || ""}
                    aria-invalid={Boolean(errors.title)}
                    onChange={(event) => updateTitle(event.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Slug" htmlFor="service-slug" required error={errors.slug} hint="Dùng cho đường dẫn /prices/[slug], viết thường không dấu.">
                  <Input
                    id="service-slug"
                    className="rounded-none"
                    value={draft.slug || ""}
                    aria-invalid={Boolean(errors.slug)}
                    onChange={(event) => updateSlug(event.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Trạng thái" htmlFor="service-status">
                  <select
                    id="service-status"
                    className="h-10 w-full rounded-none border border-input bg-background px-3 text-sm"
                    value={draft.status || "published"}
                    onChange={(event) => updateField("status", event.target.value as Service["status"])}
                  >
                    <option value="published">Đã đăng</option>
                    <option value="draft">Nháp</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Thứ tự" htmlFor="service-order" error={errors.order}>
                  <Input
                    id="service-order"
                    className="rounded-none"
                    type="number"
                    value={draft.order ?? 0}
                    aria-invalid={Boolean(errors.order)}
                    onChange={(event) => updateField("order", Number(event.target.value) as Service["order"])}
                  />
                </FieldGroup>
              </div>
            </ServiceEditorSection>

            <ServiceEditorSection title="Ảnh">
              <ServiceImagePicker
                value={draft.image || ""}
                error={errors.image}
                onChange={(value) => updateField("image", value)}
              />
            </ServiceEditorSection>

            <ServiceEditorSection title="Nội dung hiển thị">
              <div className="grid gap-4">
                <FieldGroup label="Mô tả ngắn" htmlFor="service-description" required error={errors.description}>
                  <Textarea
                    id="service-description"
                    className="min-h-28 rounded-none"
                    value={draft.description || ""}
                    aria-invalid={Boolean(errors.description)}
                    onChange={(event) => updateField("description", event.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Chi tiết hero" htmlFor="service-detail">
                  <Textarea
                    id="service-detail"
                    className="min-h-32 rounded-none"
                    value={draft.detail || ""}
                    onChange={(event) => updateField("detail", event.target.value)}
                  />
                </FieldGroup>
              </div>
            </ServiceEditorSection>

            <ServiceEditorSection title="Danh sách chi tiết">
              <div className="grid gap-4 xl:grid-cols-3">
                <ServiceRepeaterField
                  label="Features"
                  value={draft.features || []}
                  emptyLabel="Chưa có mục nổi bật"
                  placeholder="Nhập mục nổi bật"
                  onChange={(value) => updateField("features", value)}
                />
                <ServiceRepeaterField
                  label="Hạng mục bao gồm"
                  value={draft.includes || []}
                  emptyLabel="Chưa có hạng mục"
                  placeholder="Nhập hạng mục"
                  onChange={(value) => updateField("includes", value)}
                />
                <ServiceRepeaterField
                  label="Quy trình"
                  value={draft.process || []}
                  emptyLabel="Chưa có bước triển khai"
                  placeholder="Nhập bước triển khai"
                  onChange={(value) => updateField("process", value)}
                />
              </div>
            </ServiceEditorSection>

            <ServiceEditorSection title="SEO">
              <div className="grid gap-4 lg:grid-cols-2">
                <FieldGroup label="SEO title" htmlFor="service-seo-title">
                  <Input
                    id="service-seo-title"
                    className="rounded-none"
                    value={draft.seo?.title || ""}
                    onChange={(event) => updateSeo("title", event.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="OG image" htmlFor="service-seo-og-image" hint="Để trống sẽ dùng ảnh chính khi backend/public page xử lý fallback.">
                  <Input
                    id="service-seo-og-image"
                    className="rounded-none"
                    value={draft.seo?.ogImage || ""}
                    onChange={(event) => updateSeo("ogImage", event.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="SEO description" htmlFor="service-seo-description" className="lg:col-span-2" hint="Mô tả ngắn cho kết quả tìm kiếm.">
                  <Textarea
                    id="service-seo-description"
                    className="min-h-24 rounded-none"
                    value={draft.seo?.description || ""}
                    onChange={(event) => updateSeo("description", event.target.value)}
                  />
                </FieldGroup>
              </div>
            </ServiceEditorSection>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Xác nhận xóa"
        description={`Xóa dịch vụ "${confirmDelete?.title || ""}"? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa dịch vụ"
        loading={deleting}
        onConfirm={() => {
          if (confirmDelete) return handleDelete(confirmDelete);
        }}
        onOpenChange={(open) => {
          if (!open) setConfirmDelete(null);
        }}
      />

      <DirtyFormProtectionDialog
        open={dirtyForm.hasPendingNavigation}
        onConfirm={dirtyForm.confirmPendingNavigation}
        onCancel={dirtyForm.cancelPendingNavigation}
      />
    </div>
  );
}

function ServiceEditorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function FieldGroup({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ServiceImagePicker({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [imageBroken, setImageBroken] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 350);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setLoading(true);
    setMediaError("");
    getMedia({ page: 1, limit: 8, search: debouncedQuery }, { signal: controller.signal })
      .then((data) => {
        if (requestIdRef.current === requestId) setItems(data.media);
      })
      .catch((loadError) => {
        if (!isRequestCanceled(loadError) && requestIdRef.current === requestId) {
          setMediaError(getApiErrorMessage(loadError, "Không tải được thư viện ảnh"));
        }
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  useEffect(() => {
    setImageBroken(false);
  }, [value]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <div className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden border border-border bg-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- Admin-entered URLs can point outside configured Next image domains.
            <img
              src={value}
              alt="Ảnh dịch vụ đã chọn"
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setImageBroken(true)}
              onLoad={() => setImageBroken(false)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
        {imageBroken && <p className="text-xs text-destructive">Ảnh hiện tại không tải được. Kiểm tra lại URL hoặc chọn ảnh khác.</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
        <FieldGroup label="URL ảnh thủ công" htmlFor="service-image-url" hint="Dùng khi ảnh nằm ngoài thư viện media.">
          <Input
            id="service-image-url"
            className="rounded-none"
            value={value}
            placeholder="https://..."
            onChange={(event) => onChange(event.target.value)}
          />
        </FieldGroup>
      </div>

      <div className="min-w-0 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="rounded-none pl-9"
            value={query}
            placeholder="Tìm ảnh theo alt, folder..."
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Tìm ảnh trong media"
          />
        </div>
        {loading && items.length > 0 && (
          <p className="text-xs text-muted-foreground">Đang cập nhật media...</p>
        )}
        {mediaError && items.length > 0 && (
          <p className="text-xs text-destructive">{mediaError}</p>
        )}
        {loading && items.length === 0 ? (
          <PageLoading label="Đang tải media..." className="border-0 bg-muted/40" />
        ) : mediaError && items.length === 0 ? (
          <PageError message={mediaError} className="border-0" />
        ) : items.length === 0 ? (
          <EmptyState title="Không có ảnh phù hợp" description="Thử từ khóa khác hoặc nhập URL thủ công." className="border-0" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => onChange(item.url)}
                className={cn(
                  "group border border-border bg-card text-left focus-visible:ring-3 focus-visible:ring-ring/50",
                  value === item.url && "border-primary ring-2 ring-primary/20",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <CmsImage src={item.url} alt={item.alt || "Media"} className="object-cover" />
                </div>
                <p className="truncate px-2 py-2 text-xs text-muted-foreground group-hover:text-foreground">
                  {item.alt || item.folder || item.publicId}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceRepeaterField({
  label,
  value,
  emptyLabel,
  placeholder,
  onChange,
}: {
  label: string;
  value: string[];
  emptyLabel: string;
  placeholder: string;
  onChange: (value: string[]) => void;
}) {
  const updateItem = (index: number, nextValue: string) => {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3 border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={() => onChange([...value, ""])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="border border-dashed border-border p-4 text-sm text-muted-foreground">{emptyLabel}</div>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={`${label}-${index}`} className="grid grid-cols-[1fr_auto] gap-2">
              <Input
                className="rounded-none"
                value={item}
                placeholder={placeholder}
                onChange={(event) => updateItem(index, event.target.value)}
                aria-label={`${label} ${index + 1}`}
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label="Di chuyển lên"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === value.length - 1}
                  aria-label="Di chuyển xuống"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => removeItem(index)}
                  aria-label="Xóa mục"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

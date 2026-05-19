"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/admin/form-field";
import { FormActions } from "@/components/admin/form-actions";
import { FormSection } from "@/components/admin/form-section";
import { FormGrid } from "@/components/admin/form-grid";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { ImageUpload } from "@/components/editor/ImageUpload";
import { Label } from "@/components/ui/label";
import { FolderKanban } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { getAdminProject, updateProject } from "@/lib/api/projects";
import { getApiErrorMessage } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { toast } from "sonner";
import { DirtyFormProtectionDialog } from "@/components/admin";
import { useDirtyFormProtection } from "@/hooks/use-dirty-form-protection";

type ProjectDraft = {
  title: string;
  slug: string;
  category: string;
  image: string;
  description: string;
  content: string;
  link: string;
  status: "draft" | "published";
  featured: boolean;
  client: string;
  startDate: string;
  endDate: string;
};

const normalizeProjectDraft = (draft: ProjectDraft): ProjectDraft => ({
  ...draft,
  title: draft.title.trim(),
  slug: draft.slug.trim(),
  category: draft.category.trim(),
  image: draft.image.trim(),
  description: draft.description.trim(),
  link: draft.link.trim(),
  client: draft.client.trim(),
});

export default function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featured, setFeatured] = useState(false);
  const [client, setClient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseline, setBaseline] = useState<ProjectDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const currentDraft = useMemo(() => normalizeProjectDraft({
    title,
    slug,
    category,
    image,
    description,
    content,
    link,
    status,
    featured,
    client,
    startDate,
    endDate,
  }), [category, client, content, description, endDate, featured, image, link, slug, startDate, status, title]);
  const dirtyForm = useDirtyFormProtection(
    Boolean(baseline) && JSON.stringify(currentDraft) !== JSON.stringify(baseline),
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setBaseline(null);
        const project = await getAdminProject(id);
        if (project) {
          const nextDraft = normalizeProjectDraft({
            title: project.title,
            slug: project.slug || slugify(project.title),
            category: project.category,
            image: project.image,
            description: project.description,
            content: typeof project.content === 'string' ? project.content : JSON.stringify(project.content || ''),
            link: project.link || '',
            status: project.status,
            featured: project.featured,
            client: project.client || '',
            startDate: project.startDate ? project.startDate.slice(0, 10) : '',
            endDate: project.endDate ? project.endDate.slice(0, 10) : '',
          });
          setTitle(project.title);
          setSlug(nextDraft.slug);
          setSlugEdited(Boolean(project.slug));
          setCategory(project.category);
          setImage(project.image);
          setDescription(project.description);
          setContent(nextDraft.content);
          setLink(project.link || '');
          setStatus(project.status);
          setFeatured(project.featured);
          setClient(project.client || '');
          setStartDate(project.startDate ? project.startDate.slice(0, 10) : '');
          setEndDate(project.endDate ? project.endDate.slice(0, 10) : '');
          setBaseline(nextDraft);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Không tải được dự án"));
      }
    };
    fetchProject();
  }, [id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProject(id, {
        title,
        slug,
        category,
        image,
        description,
        content,
        link,
        status,
        featured,
        client,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });
      setBaseline(currentDraft);
      router.push('/admin/projects');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Không lưu được dự án"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="px-4 lg:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
        <div className="mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Sửa dự án #{id}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Chỉnh sửa thông tin dự án
                </p>
              </div>
            </div>
            <Button variant="ghost" asChild className="rounded-none">
              <Link href="/admin/projects">Quay lại</Link>
            </Button>
          </div>

          <Card className="border-border rounded-none">
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  {/* Cột trái */}
                  <div className="space-y-6">
                    <FormSection title="Thông tin cơ bản">
                      <FormField
                        id="title"
                        label="Tên dự án"
                        placeholder="Nhập tên dự án"
                        required
                        value={title}
                        onChange={handleTitleChange}
                        disabled={loading}
                        helperText="Tên dự án sẽ hiển thị trên trang web"
                      />
                      <FormField
                        id="slug"
                        label="Slug"
                        placeholder="duong-dan-du-an"
                        value={slug}
                        onChange={handleSlugChange}
                        disabled={loading}
                        helperText={`/projects/${slug || "duong-dan-du-an"}`}
                      />
                      <FormField
                        id="category"
                        label="Danh mục"
                        placeholder="Ví dụ: Biệt thự, Nhà phố, Công nghiệp"
                        required
                        value={category}
                        onChange={setCategory}
                        disabled={loading}
                      />
                      <div className="space-y-1.5">
                        <Label htmlFor="status" className="text-sm font-medium">
                          Trạng thái
                        </Label>
                        <select
                          id="status"
                          className="h-9 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-sm"
                          value={status}
                          onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}
                          disabled={loading}
                        >
                          <option value="draft">Nháp</option>
                          <option value="published">Đã đăng</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(event) => setFeatured(event.target.checked)}
                          disabled={loading}
                        />
                        Dự án nổi bật
                      </label>
                    </FormSection>

                    <FormSection title="Hình ảnh">
                      <ImageUpload imageUrl={image} onImageUpload={setImage} />
                      <FormField
                        id="image"
                        label="Ảnh đại diện"
                        placeholder="Dán URL ảnh hoặc tải ảnh lên"
                        required
                        value={image}
                        onChange={setImage}
                        disabled={loading}
                      />
                    </FormSection>
                  </div>

                  {/* Cột phải */}
                  <div className="space-y-6">
                    <FormSection title="Mô tả dự án">
                      <FormField
                        id="description"
                        label="Mô tả"
                        placeholder="Nhập mô tả dự án"
                        type="textarea"
                        rows={5}
                        maxLength={500}
                        required
                        value={description}
                        onChange={setDescription}
                        disabled={loading}
                      />
                      <div className="mt-4">
                        <label className="text-sm font-medium" htmlFor="description-full">
                          Nội dung chi tiết
                        </label>
                        <div className="mt-1.5">
                          <TiptapEditor
                            content={content}
                            onChange={setContent}
                            ariaLabel="Nội dung chi tiết"
                            placeholder="Chỉnh sửa nội dung chi tiết..."
                          />
                        </div>
                      </div>
                    </FormSection>

                    <FormSection title="Liên kết">
                      <FormField
                        id="client"
                        label="Khách hàng"
                        placeholder="Tên khách hàng"
                        value={client}
                        onChange={setClient}
                        disabled={loading}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          id="startDate"
                          label="Ngày bắt đầu"
                          inputType="date"
                          value={startDate}
                          onChange={setStartDate}
                          disabled={loading}
                        />
                        <FormField
                          id="endDate"
                          label="Ngày hoàn thành"
                          inputType="date"
                          value={endDate}
                          onChange={setEndDate}
                          disabled={loading}
                        />
                      </div>
                      <FormField
                        id="link"
                        label="Link chi tiết"
                        placeholder="/projects/duong-dan-du-an"
                        value={link}
                        onChange={setLink}
                        disabled={loading}
                      />
                    </FormSection>
                  </div>
                </FormGrid>

                <FormActions saveText={loading ? "Đang lưu..." : "Lưu thay đổi"} cancelHref="/admin/projects" disabled={loading} />
              </form>
            </CardContent>
          </Card>

          <DirtyFormProtectionDialog
            open={dirtyForm.hasPendingNavigation}
            onConfirm={dirtyForm.confirmPendingNavigation}
            onCancel={dirtyForm.cancelPendingNavigation}
          />
        </div>
      </div>
    </div>
  );
}

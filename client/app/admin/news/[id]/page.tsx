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
import { Newspaper } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { getNewsById, updateNews } from "@/lib/api/news";
import { getApiErrorMessage } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import { toast } from "sonner";
import { DirtyFormProtectionDialog } from "@/components/admin";
import { useDirtyFormProtection } from "@/hooks/use-dirty-form-protection";

type NewsDraft = {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  slug: string;
  status: "draft" | "published";
};

const normalizeNewsDraft = (draft: NewsDraft): NewsDraft => ({
  ...draft,
  title: draft.title.trim(),
  category: draft.category.trim(),
  image: draft.image.trim(),
  excerpt: draft.excerpt.trim(),
  slug: draft.slug.trim(),
});

export default function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [baseline, setBaseline] = useState<NewsDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const currentDraft = useMemo(() => normalizeNewsDraft({
    title,
    category,
    image,
    excerpt,
    content,
    slug,
    status,
  }), [category, content, excerpt, image, slug, status, title]);
  const dirtyForm = useDirtyFormProtection(
    Boolean(baseline) && JSON.stringify(currentDraft) !== JSON.stringify(baseline),
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setBaseline(null);
        const news = await getNewsById(id);
        if (news) {
          const nextDraft = normalizeNewsDraft({
            title: news.title,
            category: news.category,
            image: news.image,
            excerpt: news.excerpt,
            content: typeof news.content === 'string' ? news.content : JSON.stringify(news.content),
            slug: news.slug || slugify(news.title),
            status: news.status,
          });
          setTitle(news.title);
          setCategory(news.category);
          setImage(news.image);
          setExcerpt(news.excerpt);
          setContent(nextDraft.content);
          setSlug(nextDraft.slug);
          setSlugEdited(Boolean(news.slug));
          setStatus(news.status);
          setBaseline(nextDraft);
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Không tải được bài viết"));
      }
    };
    fetchNews();
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
      await updateNews(id, {
        title,
        category,
        image,
        excerpt,
        content,
        slug,
        status
      });
      setBaseline(currentDraft);
      router.push('/admin/news');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Không lưu được bài viết"));
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
                <Newspaper className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Sửa tin tức #{id}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Chỉnh sửa nội dung bài viết
                </p>
              </div>
            </div>
            <Button variant="ghost" asChild className="rounded-none">
              <Link href="/admin/news">Quay lại</Link>
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
                        label="Tiêu đề"
                        placeholder="Nhập tiêu đề bài viết"
                        required
                        value={title}
                        onChange={handleTitleChange}
                        disabled={loading}
                        helperText="Tiêu đề nên ngắn gọn, hấp dẫn"
                      />
                      <FormField
                        id="slug"
                        label="Slug"
                        placeholder="duong-dan-bai-viet"
                        value={slug}
                        onChange={handleSlugChange}
                        disabled={loading}
                        helperText={`/news/${slug || "duong-dan-bai-viet"}`}
                      />
                      <FormField
                        id="category"
                        label="Danh mục"
                        placeholder="Ví dụ: Tư vấn, Thiết kế, Kỹ thuật"
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
                    <FormSection title="Nội dung">
                      <FormField
                        id="excerpt"
                        label="Tóm tắt"
                        placeholder="Nhập tóm tắt bài viết"
                        type="textarea"
                        rows={3}
                        maxLength={300}
                        required
                        value={excerpt}
                        onChange={setExcerpt}
                        disabled={loading}
                        helperText="Tóm tắt ngắn gọn nội dung chính"
                      />
                      <div className="mt-4">
                        <label className="text-sm font-medium" htmlFor="content">
                          Nội dung
                        </label>
                        <div className="mt-1.5">
                          <TiptapEditor
                            content={content}
                            onChange={setContent}
                            ariaLabel="Nội dung"
                            placeholder="Chỉnh sửa nội dung bài viết..."
                          />
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </FormGrid>

                <FormActions saveText={loading ? "Đang lưu..." : "Lưu thay đổi"} cancelHref="/admin/news" disabled={loading} />
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

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Newspaper, FileText, FileClock } from "lucide-react";
import { DataTable, Column } from "@/components/admin/data-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { News } from "@/types/api";
import { deleteNews, getAllNews } from "@/lib/api/news";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { AdminPageHeader, PageError, StatusBadge } from "@/components/admin";

export default function AdminNewsPage() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0 });

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNews({
        page,
        limit: 10,
        search,
        status: status as "" | "draft" | "published",
        sortBy,
        sortOrder,
      });
      setNewsItems(data.news);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (data.counts) setCounts(data.counts);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Không tải được tin tức"));
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sortBy, sortOrder]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleDelete = async (item: News) => {
    try {
      await deleteNews(item._id);
      toast.success("Đã xóa tin tức");
      await fetchNews();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không xóa được tin tức"));
      throw err;
    }
  };

  // Show initial loading state
  if (loading && newsItems.length === 0) {
    return (
      <div className="min-h-svh bg-background">
        <div className="px-4 lg:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
          <AdminPageHeader
            title="Tin tức"
            description="Quản lý bài viết và nội dung trên website"
            action={
            <Button size="sm" className="rounded-none" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tin tức
            </Button>
            }
          />

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border shadow-sm rounded-none py-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show initial error state
  if (error && newsItems.length === 0) {
    return (
      <div className="min-h-svh bg-background">
        <div className="px-4 lg:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
          <AdminPageHeader title="Tin tức" description="Quản lý bài viết và nội dung trên website" />
          <PageError message={error} onRetry={fetchNews} />
        </div>
      </div>
    );
  }

  // Calculate counts
  const publishedCount = counts.published;
  const draftCount = counts.draft;

  // Format date helper
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  const columns: Column<News>[] = [
    {
      key: "title",
      header: "Tiêu đề",
      sortable: true,
      width: "40%",
    },
    {
      key: "category",
      header: "Danh mục",
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {item.category}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="min-h-svh bg-background">
      <div className="px-4 lg:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
        <AdminPageHeader
          title="Tin tức"
          description="Quản lý bài viết và nội dung trên website"
          action={
          <Button size="sm" className="rounded-none" asChild>
            <Link href="/admin/news/new">
              <Plus className="h-4 w-4 mr-2" />
              Thêm tin tức
            </Link>
          </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-border shadow-sm rounded-none py-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Newspaper className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tổng bài viết</p>
                <p className="text-lg font-semibold">{counts.all}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm rounded-none py-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                <FileText className="h-4.5 w-4.5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Đã đăng</p>
                <p className="text-lg font-semibold">{publishedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm rounded-none py-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <FileClock className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nháp</p>
                <p className="text-lg font-semibold">{draftCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DataTable
          data={newsItems}
          columns={columns}
          searchPlaceholder="Tìm kiếm tin tức..."
          itemsPerPage={10}
          actionLink={(item) => `/admin/news/${item._id}`}
          onDelete={handleDelete}
          emptyMessage="Chưa có tin tức phù hợp"
          loading={loading}
          error={error}
          onRetry={fetchNews}
          totalItems={total}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          searchQuery={search}
          onSearchChange={setSearch}
          filterable
          filterOptions={[
            { label: "Đã đăng", value: "published" },
            { label: "Nháp", value: "draft" },
          ]}
          activeFilter={status}
          onFilterChange={setStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(key, order) => {
            setSortBy(key);
            setSortOrder(order);
          }}
        />
      </div>
    </div>
  );
}

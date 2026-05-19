"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Newspaper,
  FolderKanban,
  TrendingUp,
  ArrowRight,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/skeleton-dashboard";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { AdminPageHeader, EmptyState, PageError, StatusBadge } from "@/components/admin";

export default function AdminDashboard() {
  const {
    stats,
    recentNews,
    recentProjects,
    loading,
    error
  } = useAdminStats();

  // Show loading state
  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-svh bg-background">
        <div className="px-4 lg:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
          <AdminPageHeader
            title="Bảng điều khiển"
            description="Tổng quan nội dung và trạng thái vận hành website"
          />
          <PageError
            message="Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="px-4 lg:px-6 py-6 lg:py-8 pt-16 lg:pt-8">
        <AdminPageHeader
          title="Bảng điều khiển"
          description="Chào mừng trở lại. Quản lý nội dung website tại đây."
        />

        <h2 className="mb-3 text-sm font-semibold text-foreground">Chỉ số chính</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-border transition-colors hover:border-primary/40 py-0 rounded-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10">
                  <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tổng tin tức</p>
                  <p className="text-2xl font-bold">{stats?.news || 0}</p>
                  <p className="text-xs text-muted-foreground">bài viết</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border transition-colors hover:border-primary/40 py-0 rounded-none">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tổng dự án</p>
                  <p className="text-2xl font-bold">{stats?.projects || 0}</p>
                  <p className="text-xs text-muted-foreground">dự án</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/admin/contacts">
            <Card className="border-border transition-colors hover:border-primary/40 py-0 rounded-none">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tổng liên hệ</p>
                    <p className="text-2xl font-bold">{stats?.contacts || 0}</p>
                    <p className="text-xs text-muted-foreground">liên hệ mới</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <h2 className="mb-3 text-sm font-semibold text-foreground">Nội dung gần đây</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent News */}
          <Card className="border-border rounded-none py-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Tin tức mới
                </h2>
                <Link
                  href="/admin/news"
                  className="text-xs text-primary hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-3">
                {recentNews.length > 0 ? (
                  recentNews.map((item) => {
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    );
                  })
                ) : (
                  <EmptyState title="Chưa có tin tức nào" className="border-0 bg-transparent py-4" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="border-border rounded-none py-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Dự án mới
                </h2>
                <Link
                  href="/admin/projects"
                  className="text-xs text-primary hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-3">
                {recentProjects.length > 0 ? (
                  recentProjects.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState title="Chưa có dự án nào" className="border-0 bg-transparent py-4" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Truy cập nhanh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/news">
              <Card className="group cursor-pointer border-border hover:shadow-md hover:-translate-y-0.5 transition-all rounded-none py-0">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Newspaper className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Quản lý tin tức</h3>
                    <p className="text-xs text-muted-foreground">
                      Thêm, sửa, xoá bài viết
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/projects">
              <Card className="group cursor-pointer border-border hover:shadow-md hover:-translate-y-0.5 transition-all rounded-none py-0">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FolderKanban className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Quản lý dự án</h3>
                    <p className="text-xs text-muted-foreground">
                      Thêm, sửa, xoá dự án
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

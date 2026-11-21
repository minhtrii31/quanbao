"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";
import { getProjectPage } from "@/lib/api/projects";
import type { Project } from "@/types/api";
import ProjectCard from "@/components/public/project-card";
import CollectionState, {
  CollectionSkeleton,
} from "@/components/public/collection-state";

const PROJECT_PAGE_SIZE = 9;

export default function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInitialProjects = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setLoadMoreError(false);
    try {
      const data = await getProjectPage({ page: 1, limit: PROJECT_PAGE_SIZE });
      setProjects(data.projects);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    getProjectPage({ page: 1, limit: PROJECT_PAGE_SIZE })
      .then((data) => {
        if (!mounted) return;
        setProjects(data.projects);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      })
      .catch(() => {
        if (mounted) setHasError(true);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || currentPage >= totalPages) return;
    setIsLoadingMore(true);
    setLoadMoreError(false);
    try {
      const data = await getProjectPage({
        page: currentPage + 1,
        limit: PROJECT_PAGE_SIZE,
      });
      setProjects((items) => [...items, ...data.projects]);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch {
      setLoadMoreError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className="section-space">
      <div className="site-container">
        {isLoading ? (
          <CollectionSkeleton count={6} />
        ) : hasError ? (
          <CollectionState
            message="Chưa thể tải danh sách dự án lúc này. Vui lòng thử lại sau."
            onRetry={fetchInitialProjects}
          />
        ) : projects.length === 0 ? (
          <CollectionState message="Chưa có dự án nào." />
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between border-b border-border pb-5 text-xs">
              <span className="font-medium uppercase tracking-wider">
                Hồ sơ công trình
              </span>
              <span className="text-muted-foreground">
                {projects.length} công trình đã tải
              </span>
            </div>
            <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            {currentPage < totalPages && (
              <div className="mt-12 flex flex-col items-center gap-4">
                {loadMoreError && (
                  <p role="alert" className="text-sm text-destructive">
                    Chưa thể tải thêm dự án. Vui lòng thử lại.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="brand-button-outline min-w-44 disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowDown className="size-4" />
                  )}
                  {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

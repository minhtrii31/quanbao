"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowRight, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectGridSkeleton } from "@/components/ui/skeleton-project";
import { getProjectPage } from "@/lib/api/projects";
import { Project } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import { CmsImage } from "@/components/public/cms-image";

const PROJECT_PAGE_SIZE = 9;

function ProjectListErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mb-8 sm:mb-10 flex flex-col items-center gap-2 lg:gap-3">
          <span className="inline-block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider section-header">
            CÁC DỰ ÁN TIÊU BIỂU
          </span>
          <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Những công trình tiêu biểu thể hiện năng lực và cam kết chất lượng
            của Quân Bảo
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Chưa thể tải danh sách dự án lúc này. Vui lòng thử lại sau.
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-none border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={onRetry}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </div>
    </section>
  );
}

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
    } catch (error) {
      console.error("Failed to load public project list", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getProjectPage({ page: 1, limit: PROJECT_PAGE_SIZE })
      .then((data) => {
        if (!isMounted) return;
        setProjects(data.projects);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setHasError(false);
        setLoadMoreError(false);
        setIsLoading(false);
      }).catch((error) => {
        console.error("Failed to load public project list", error);
        if (!isMounted) return;
        setHasError(true);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    setLoadMoreError(false);
    try {
      const nextPage = currentPage + 1;
      const data = await getProjectPage({ page: nextPage, limit: PROJECT_PAGE_SIZE });
      setProjects((items) => [...items, ...data.projects]);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load more public projects", error);
      setLoadMoreError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <ProjectGridSkeleton />;
  }

  if (hasError) {
    return <ProjectListErrorState onRetry={fetchInitialProjects} />;
  }

  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mb-8 sm:mb-10 flex flex-col items-center gap-2 lg:gap-3">
          <span className="inline-block text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider section-header">
            CÁC DỰ ÁN TIÊU BIỂU
          </span>
          <p className="max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            Những công trình tiêu biểu thể hiện năng lực và cam kết chất lượng
            của Quân Bảo
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có dự án nào.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project, index) => {
                const projectHref = `/projects/${project.slug || project._id}`;
                return (
                <Card
                  key={project._id || index}
                  className="group relative overflow-hidden rounded-none border-0 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 py-0"
                >
                  <Link href={projectHref} className="block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <CmsImage
                        src={project.image}
                        alt={project.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-none bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5 sm:p-6">
                    <Link href={projectHref}>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <Link href={projectHref}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-none border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn"
                      >
                        Xem chi tiết
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
                );
              })}
            </div>

            {currentPage < totalPages && (
              <div className="mt-8 flex flex-col items-center gap-3 text-center sm:mt-10">
                {loadMoreError && (
                  <p className="text-sm text-muted-foreground">
                    Chưa thể tải thêm dự án. Vui lòng thử lại.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 min-w-40 rounded-none border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                >
                  {isLoadingMore ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowDown className="mr-2 h-4 w-4" />
                  )}
                  {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

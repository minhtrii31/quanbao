"use client";

import { useProjects } from "@/hooks/use-projects";
import SectionHeading from "@/components/public/section-heading";
import ProjectCard from "@/components/public/project-card";
import CollectionState, {
  CollectionSkeleton,
} from "@/components/public/collection-state";

export default function LatestProjectHome() {
  const { projects, loading, error, refetch } = useProjects();
  return (
    <section className="section-space">
      <div className="site-container">
        <SectionHeading
          title="Dự án đã thực hiện"
          description="Hồ sơ công trình do Quân Bảo cập nhật."
          href="/projects"
          linkLabel="Tất cả dự án"
        />
        {loading ? (
          <CollectionSkeleton />
        ) : error ? (
          <CollectionState
            message="Chưa thể tải danh sách dự án. Vui lòng thử lại."
            onRetry={refetch}
          />
        ) : projects.length === 0 ? (
          <CollectionState message="Các dự án sẽ được cập nhật tại đây." />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

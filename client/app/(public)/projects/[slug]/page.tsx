import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Building2, CalendarDays, Star } from "lucide-react";
import { getProject } from "@/lib/api/projects";
import { ContentRenderer } from "@/components/editor/ContentRenderer";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/public/cms-image";

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);

  if (!project) {
    return {
      title: "Không tìm thấy dự án",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image, alt: project.title }],
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);

  if (!project) notFound();
  if (isObjectId(slug) && project.slug) redirect(`/projects/${project.slug}`);

  return (
    <article className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12 lg:px-6">
        <Button variant="ghost" asChild className="rounded-none mb-6">
          <Link href="/projects" className="underline underline-offset-4">
            Quay lại dự án
          </Link>
        </Button>

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] lg:gap-8">
          <div className="min-w-0">
            <span className="inline-flex max-w-full rounded-none bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {project.category}
            </span>
            <h1 className="mt-4 break-words text-2xl font-bold leading-tight text-foreground sm:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 break-words text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="min-w-0 space-y-3 border border-border bg-card p-4 sm:p-5">
            {project.client && (
              <div className="flex min-w-0 gap-3 text-sm">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="font-medium">Khách hàng</p>
                  <p className="break-words text-muted-foreground">
                    {project.client}
                  </p>
                </div>
              </div>
            )}
            {(project.startDate || project.endDate) && (
              <div className="flex min-w-0 gap-3 text-sm">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="font-medium">Thời gian</p>
                  <p className="break-words text-muted-foreground">
                    {[project.startDate, project.endDate]
                      .filter(Boolean)
                      .map((date) =>
                        new Date(date as string).toLocaleDateString("vi-VN"),
                      )
                      .join(" - ")}
                  </p>
                </div>
              </div>
            )}
            {project.featured && (
              <div className="flex gap-3 text-sm">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="font-medium">Dự án nổi bật</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden">
          <CmsImage
            src={project.image}
            alt={project.title}
            className="object-cover"
          />
        </div>

        {project.content && (
          <ContentRenderer content={project.content} className="mt-8" />
        )}
      </div>
    </article>
  );
}

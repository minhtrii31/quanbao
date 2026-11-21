import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CmsImage } from "@/components/public/cms-image";
import type { Project } from "@/types/api";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug || project._id}`}
      className="group block min-w-0"
    >
      <div className="image-frame aspect-[4/3]">
        <CmsImage
          src={project.image}
          alt={project.title}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-wider">
          {project.category}
        </span>
        <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center bg-white text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="border-b border-border py-5">
        <h3 className="text-xl font-medium leading-snug tracking-tight transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted-foreground">
          {project.description}
        </p>
      </div>
    </Link>
  );
}

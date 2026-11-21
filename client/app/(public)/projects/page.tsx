import ProjectGrid from "@/components/public/projects/project-grid";
import PageIntro from "@/components/public/page-intro";
import ContactBanner from "@/components/public/contact-banner";

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Dự án"
        title="Dự án"
        description="Hồ sơ các công trình đã được Quân Bảo thực hiện và cập nhật."
      />
      <ProjectGrid />
      <ContactBanner />
    </>
  );
}

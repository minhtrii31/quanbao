import FooterPublic from "@/components/layouts/public/footer-public";
import HeaderPublic from "@/components/layouts/public/header-public";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-site flex min-h-svh flex-col">
      <a href="#main-content" className="skip-link">
        Đến nội dung chính
      </a>
      <HeaderPublic />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <FooterPublic />
    </div>
  );
}

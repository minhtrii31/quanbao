import FooterPublic from "@/components/layouts/public/footer-public";
import HeaderPublic from "@/components/layouts/public/header-public";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderPublic />
      <main>{children}</main>
      <FooterPublic />
    </>
  );
}

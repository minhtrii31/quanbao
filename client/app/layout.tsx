import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth-context";
import { getSiteSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, company } = await getSiteSettings();
  const title = seo.title || "Quân Bảo - Xây dựng uy tín, chất lượng đẳng cấp";
  const description =
    seo.description ||
    "Công ty TNHH Đầu Tư Xây Dựng Quân Bảo - Chuyên xây nhà trọn gói, sửa chữa, thiết kế, phần thô công trình tại TP.HCM.";
  const image = seo.ogImage || "/assets/home/1.avif";
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: "xây nhà, sửa nhà, thiết kế kiến trúc, xây dựng, Quân Bảo, TP.HCM",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: company.name || "Quân Bảo",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: company.name || "Quân Bảo Construction",
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

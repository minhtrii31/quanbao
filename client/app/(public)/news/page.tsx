import NewsLayout from "@/components/public/news/news-layout";
import PageIntro from "@/components/public/page-intro";
import ContactBanner from "@/components/public/contact-banner";

export default function NewsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tin tức"
        title="Tin tức và bài viết"
        description="Thông tin doanh nghiệp, kinh nghiệm xây dựng và các lưu ý khi chuẩn bị thi công."
      />
      <NewsLayout />
      <ContactBanner />
    </>
  );
}

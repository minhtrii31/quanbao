import Image from "next/image";

export default function OverviewAbout() {
  return (
    <section className="w-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6 py-12 lg:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary uppercase tracking-wide">
            GIỚI THIỆU
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              Công ty TNHH Đầu Tư Xây Dựng Quân Bảo là đơn vị uy tín hàng đầu
              trong lĩnh vực xây dựng và thiết kế công trình.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              Với đội ngũ kỹ sư, kiến trúc sư lành nghề, chúng tôi cam kết mang đến
              những công trình chất lượng cao, tiến độ rõ ràng và đảm bảo an toàn.
            </p>
            <p className="text-base text-foreground leading-relaxed">
              Từ nhà dân dụng đến dự án công nghiệp quy mô lớn, Quân Bảo luôn sẵn sàng
              đáp ứng mọi yêu cầu của khách hàng.
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60"
              alt="Công ty Quân Bảo"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[
            { number: "10+", label: "Năm kinh nghiệm" },
            { number: "200+", label: "Dự án hoàn thành" },
            { number: "50+", label: "Đối tác tin cậy" },
            { number: "100%", label: "Khách hàng hài lòng" },
          ].map((item, i) => (
            <div key={i} className="text-center py-4">
              <span className="text-2xl lg:text-3xl font-bold text-primary">{item.number}</span>
              <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

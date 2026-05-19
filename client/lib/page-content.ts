export type ValueBlock = {
  title: string;
  description: string;
  image?: string;
};

export type HomeContent = {
  heroImages: string[];
  overview: {
    title: string;
    intro: string[];
    serviceIntro: string;
    services: string[];
    closing: string[];
  };
  values: ValueBlock[];
};

export type AboutContent = {
  hero: {
    title: string;
    highlight: string;
    description: string;
    image: string;
  };
  stats: Array<{ number: string; label: string }>;
  values: ValueBlock[];
  timeline: Array<{ year: string; title: string; description: string }>;
  vision: {
    title: string;
    vision: string;
    mission: string;
  };
};

const valueImages = [
  "https://www.cc1.vn/wp-content/uploads/2022/04/Group-15326.png",
  "https://www.cc1.vn/wp-content/uploads/2022/04/Group-14781.png",
  "https://www.cc1.vn/wp-content/uploads/2022/04/Group-15327.png",
];

export const DEFAULT_HOME_CONTENT: HomeContent = {
  heroImages: ["/assets/home/1.avif", "/assets/home/2.avif", "/assets/home/3.avif"],
  overview: {
    title: "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG QUÂN BẢO",
    intro: [
      "Công ty TNHH Đầu Tư Xây Dựng Quân Bảo đã có một quá trình phát triển từng bước và là một địa chỉ uy tín trong lĩnh vực xây dựng và thiết kế. Với nền tảng kinh nghiệm và sự chuyên nghiệp, chúng tôi cam kết mang đến cho khách hàng những dịch vụ chất lượng và đáng tin cậy.",
    ],
    serviceIntro: "Chúng tôi chuyên cung cấp các dịch vụ sau:",
    services: [
      "Xây dựng công trình: Từ nhà dân dụng nhỏ, nhà phố đến những dự án lớn như nhà xưởng và biệt thự, chúng tôi đều có đội ngũ kỹ thuật lành nghề và đầy đủ kinh nghiệm.",
      "Sửa chữa và nâng cấp công trình: Chúng tôi cung cấp dịch vụ sửa chữa và nâng cấp đa dạng cho mọi loại công trình.",
      "Thiết kế công trình: Đội ngũ kiến trúc sư sẵn sàng tư vấn và thiết kế những công trình đẹp mắt, hiện đại và hợp phong thủy.",
      "Sơn phủ công trình: Chúng tôi cung cấp dịch vụ sơn phủ chất lượng cao để bảo vệ và làm đẹp cho mọi công trình xây dựng.",
    ],
    closing: [
      "Công ty TNHH Đầu Tư Xây Dựng Quân Bảo đã trải qua một quá trình phát triển vững chắc và không ngừng hoàn thiện từng ngày.",
      "Với đội ngũ kỹ sư, kiến trúc sư, nhà thầu và công nhân lành nghề, chúng tôi tự hào mang đến những sản phẩm xây dựng chất lượng.",
      "Chúng tôi chú trọng tư vấn và đề xuất các giải pháp tiết kiệm chi phí, hiệu quả về mặt kỹ thuật và thẩm mỹ.",
      "Uy tín, chất lượng và sự chuyên nghiệp giúp Quân Bảo trở thành một đối tác đáng tin cậy trong lĩnh vực xây dựng và thiết kế.",
    ],
  },
  values: [
    {
      image: valueImages[0],
      title: "Uy tín",
      description: "Uy tín là trên hết, tận dụng mọi cơ hội để chứng minh sự chân thành và trung thực.",
    },
    {
      image: valueImages[1],
      title: "Chất lượng",
      description: "Chất lượng là ưu tiên hàng đầu, chúng tôi cam kết đảm bảo chất lượng tốt nhất.",
    },
    {
      image: valueImages[2],
      title: "Hiệu quả",
      description: "Hiệu quả là trọng tâm của mọi hoạt động, tối ưu lợi ích cho khách hàng.",
    },
  ],
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  hero: {
    title: "XÂY DỰNG TƯƠNG LAI VỮNG BỀN CÙNG",
    highlight: "QUÂN BẢO",
    description: "Đơn vị uy tín hàng đầu trong lĩnh vực xây dựng và thiết kế công trình với hơn 10 năm kinh nghiệm.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60",
  },
  stats: [
    { number: "10+", label: "Năm kinh nghiệm" },
    { number: "200+", label: "Dự án hoàn thành" },
    { number: "50+", label: "Đối tác tin cậy" },
    { number: "100%", label: "Khách hàng hài lòng" },
  ],
  values: [
    { image: valueImages[0], title: "Uy tín", description: "Chân thành và trung thực trong mọi giao dịch." },
    { image: valueImages[1], title: "Chất lượng", description: "Cam kết tiêu chuẩn cao nhất cho mọi công trình." },
    { image: valueImages[2], title: "Hiệu quả", description: "Giải pháp tối ưu chi phí và tiến độ." },
  ],
  timeline: [
    { year: "2014", title: "Thành lập công ty", description: "Khởi đầu hành trình xây dựng" },
    { year: "2016", title: "Mở rộng quy mô", description: "Tăng trưởng mạnh mẽ" },
    { year: "2018", title: "Phát triển dịch vụ", description: "Đa dạng hóa lĩnh vực" },
    { year: "2020", title: "Đạt chuẩn quốc tế", description: "Chất lượng vượt trội" },
    { year: "2022", title: "Bứt phá mới", description: "Công nghệ hiện đại" },
    { year: "2024", title: "Tiếp tục phát triển", description: "Vươn tầm khu vực" },
  ],
  vision: {
    title: "Tầm nhìn & Sứ mệnh",
    vision: "Trở thành đơn vị xây dựng uy tín hàng đầu, mang thương hiệu Quân Bảo vươn tầm khu vực với chuẩn mực chất lượng quốc tế.",
    mission: "Cung cấp giải pháp xây dựng chất lượng cao, hiệu quả cho khách hàng, đồng thời xây dựng đội ngũ chuyên nghiệp và bền vững.",
  },
};

export const getHomeContent = async (): Promise<HomeContent> => {
  return DEFAULT_HOME_CONTENT;
};

export const getAboutContent = async (): Promise<AboutContent> => {
  return DEFAULT_ABOUT_CONTENT;
};

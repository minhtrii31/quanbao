// Company Information
export const COMPANY = {
  name: "CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG QUÂN BẢO",
  tagline: "UY TÍN VỮNG CHẮC - XÂY DỰNG ĐẲNG CẤP",
  address: "Số 451/30 đường Xô Viết Nghệ Tĩnh, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
  phone: "0938 888 888",
  phoneRaw: "0938888888",
  email: "xaydungquanbao@gmail.com",
  workingHours: "Thứ 2 - Thứ 7: 7:30 - 17:30",
} as const;

// Social Links
export const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=100091774462739",
  zalo: "https://zalo.me/093888888",
} as const;

export const DEFAULT_SITE_SETTINGS = {
  company: COMPANY,
  social: SOCIAL,
  seo: {
    title: "Quân Bảo Construction",
    description: "Dịch vụ xây dựng, sửa chữa và thiết kế thi công chuyên nghiệp.",
    ogImage: "",
  },
} as const;

// Navigation Links
export const NAVIGATION = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/prices", label: "Dịch vụ" },
  { href: "/projects", label: "Dự án" },
  { href: "/news", label: "Tin tức" },
  { href: "/contact", label: "Liên hệ" },
] as const;

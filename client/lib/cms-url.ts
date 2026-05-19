const DEFAULT_CMS_IMAGE_HOSTS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "www.cc1.vn",
  "m.media-amazon.com",
];

const getApprovedImageHosts = () => {
  const configuredHosts = (process.env.NEXT_PUBLIC_CMS_ALLOWED_IMAGE_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...DEFAULT_CMS_IMAGE_HOSTS, ...configuredHosts]);
};

export function isApprovedCmsImageUrl(src: string) {
  if (/^\s*data:image\//i.test(src)) return false;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && getApprovedImageHosts().has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

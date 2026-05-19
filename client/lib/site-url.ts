const localHostnames = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (process.env.NODE_ENV !== "production") {
    return (configuredUrl || "http://localhost:3000").replace(/\/$/, "");
  }

  if (!configuredUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is required in production");
  }

  const url = new URL(configuredUrl);

  if (url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use https in production");
  }

  if (localHostnames.has(url.hostname)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must not use localhost in production");
  }

  if (configuredUrl !== url.origin) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an exact origin with no path, query, hash, or trailing slash");
  }

  return url.origin;
};

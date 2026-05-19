import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "quanbao_admin_token";
const DEFAULT_DEV_API_URL = "http://localhost:5000/api";

const getApiUrl = () => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production" ? undefined : DEFAULT_DEV_API_URL);

  if (!configuredUrl) return null;

  try {
    return new URL(configuredUrl);
  } catch {
    return null;
  }
};

const canReadApiCookieOnNextHost = (request: NextRequest) => {
  const apiUrl = getApiUrl();

  if (!apiUrl) return false;

  return apiUrl.hostname === request.nextUrl.hostname;
};

export function proxy(request: NextRequest) {
  if (request.cookies.has(AUTH_COOKIE_NAME)) {
    return NextResponse.next();
  }

  if (!canReadApiCookieOnNextHost(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/admin/:path*",
};

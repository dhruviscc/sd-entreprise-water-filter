import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "./modules/auth/authCookie";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/api/auth")) {
    return NextResponse.next();
  }

  const hasSessionCookie =
    request.cookies.has(AUTH_COOKIE_NAME) || request.cookies.has(REFRESH_COOKIE_NAME);

  if (!hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

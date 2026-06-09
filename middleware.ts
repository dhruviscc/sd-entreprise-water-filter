import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SESSION_EXPIRES_COOKIE = "sdenterprise_session_expires";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  const expiresAt = request.cookies.get(
    SESSION_EXPIRES_COOKIE
  )?.value;

  // Force logout after 7 days
  if (expiresAt && Date.now() > Number(expiresAt)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";

    const logoutResponse = NextResponse.redirect(redirectUrl);

    request.cookies.getAll().forEach((cookie) => {
      if (
        cookie.name.startsWith("sb-") ||
        cookie.name.startsWith("sdenterprise_")
      ) {
        logoutResponse.cookies.delete(cookie.name);
      }
    });

    return logoutResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected Admin Routes
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/api")
  ) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Logged-in users cannot access login page
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
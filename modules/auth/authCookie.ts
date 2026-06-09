import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "sdenterprise_access_token";
export const REFRESH_COOKIE_NAME = "sdenterprise_refresh_token";
export const SESSION_EXPIRES_COOKIE = "sdenterprise_session_expires";

const SESSION_DAYS = 7;
const SESSION_MAX_AGE = 60 * 60 * 24 * SESSION_DAYS;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  const expiresAt =
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;

  response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE,
  });

  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE,
  });

  response.cookies.set(
    SESSION_EXPIRES_COOKIE,
    expiresAt.toString(),
    {
      ...cookieOptions,
      maxAge: SESSION_MAX_AGE,
    }
  );
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete(REFRESH_COOKIE_NAME);
  response.cookies.delete(SESSION_EXPIRES_COOKIE);
}
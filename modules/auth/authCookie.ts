import { NextResponse } from "next/server";

const ACCESS_TOKEN_MAX_AGE = 86400; // 1 day
const REFRESH_TOKEN_MAX_AGE = 86400; // 1 day
const COOKIE_PATH = "/";
const isProduction = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_NAME = "sdenterprise_access_token";
export const REFRESH_COOKIE_NAME = "sdenterprise_refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: COOKIE_PATH,
};

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  response.cookies.set(REFRESH_COOKIE_NAME, "", {
    ...cookieOptions,
    maxAge: 0,
  });
}

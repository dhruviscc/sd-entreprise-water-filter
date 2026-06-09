import { loginUser } from "@/modules/auth/authService";
import { NextResponse } from "next/server";
import { setAuthCookies } from "@/modules/auth/authCookie";

const SESSION_DAYS = 7;
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    const { session, user } = result;

    if (!session?.access_token || !session?.refresh_token) {
      return NextResponse.json(
        {
          error: "Invalid login response from auth provider.",
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Login successful",
        user,
      },
      { status: 200 }
    );

    // Access + Refresh Token Cookies
    setAuthCookies(
      response,
      session.access_token,
      session.refresh_token,
      // session.expires_in ?? 86400
    );

    // Force Logout After 7 Days
    response.cookies.set(
      "sdenterprise_session_expires",
      (
        Date.now() +
        SESSION_DAYS * 24 * 60 * 60 * 1000
      ).toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      }
    );

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "An error occurred during login",
      },
      {
        status: error?.status || 500,
      }
    );
  }
}
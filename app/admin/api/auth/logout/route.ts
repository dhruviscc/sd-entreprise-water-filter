import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/modules/auth/authCookie";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout successful",
  });

  clearAuthCookies(response);

  response.cookies.delete("sdenterprise_session_expires");

  return response;
}